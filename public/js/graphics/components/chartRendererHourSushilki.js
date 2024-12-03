import { showNoDataMessage, hideNoDataMessage, showPreloader, hidePreloader } from './uiUtils.js';
import { insertGapsInData, hasNoValidData } from './dataUtils.js';
import { createCrosshairPlugin, chartAreaBorderPlugin, colors } from './chartUtils.js';
import { fetchData } from './fetchData.js';
import { displayNamesSushilka } from './data.js';

export function createChart({ parameterType, elements, labels, units, yAxisConfig, chartTitle }) {
  let chartInstance = null;
  let isDataVisible = true;

  // Основная функция для рендеринга графика
  async function renderChart(start, end, isAutoUpdate = false, removeRightPadding = false) {
    try {
      if (!isAutoUpdate) showPreloader(elements);

      const data = await fetchData(parameterType, start, end);
      const chartData = {};
      let hasData = false;



      labels.forEach((label) => {
        const dataset = data.map((item) => {
          const value = getValueByLabel(item, label);
          return { x: new Date(item.lastUpdated), y: typeof value === 'number' ? value : null };
        });
        chartData[label] = insertGapsInData(dataset);
        if (!hasNoValidData(chartData[label])) hasData = true;
      });

      if (!hasData) {
        if (!isAutoUpdate) hidePreloader(elements);
        showNoDataMessage(elements, chartInstance);
        destroyChart();
        return;
      }

      hideNoDataMessage(elements);

      if (!chartInstance) {
        const ctx = elements.chartCanvas.getContext('2d');
        chartInstance = new Chart(ctx, {
          type: 'line',
          data: {
            datasets: Object.keys(chartData).map((key, index) => ({
              label: key,
              data: chartData[key],
              borderColor: colors[index % colors.length],
              backgroundColor: colors[index % colors.length],
              borderWidth: 2,
              pointRadius: 0,
              spanGaps: false,
            })),
          },
          options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                mode: 'index',
                intersect: false,
                position: 'nearest', // Позиционирует тултип рядом с точкой
                xAlign: 'left', // Расположение тултипа справа
                yAlign: 'center', // Центрирование по вертикали
                callbacks: {
                  label: function (tooltipItem) {
                    const datasetLabel = tooltipItem.dataset.label || '';
                    const value = tooltipItem.parsed.y;
                    const datasetIndex = tooltipItem.datasetIndex;
                    const unit = units[datasetIndex] || '';
                    return `${datasetLabel}: ${value} ${unit}`;
                  },
                },
                // Увеличение шрифта тултипа
                titleFont: {
                  size: 13, // Размер шрифта заголовка тултипа
                  weight: 'bold',
                },
                bodyFont: {
                  size: 12, // Размер шрифта для тела тултипа
                },
              },
              title: {
                display: true,
                text: chartTitle,
                color: 'green',
                font: { size: 24, weight: 'bold' },
              },
              legend: {
                position: 'right',
                labels: {
                  font: {
                    size: 13, // Увеличение шрифта легенды
                  },
                  generateLabels: function (chart) {
                    return chart.data.datasets.map((dataset, i) => {
                      const lastVisiblePoint = dataset.data.filter((d) => d.y !== null).slice(-1)[0];
                      const lastValue = lastVisiblePoint ? lastVisiblePoint.y : '-';
                      const unit = units[i] || '';

                      // Используем отображаемое имя из displayNames или, если его нет, оригинальное имя
                      const displayName = displayNamesSushilka[dataset.label] || dataset.label;

                      // Форматируем текст так, чтобы сначала отображались lastValue и unit, затем цвет графика и название
                      return {
                        text: `${lastValue} ${unit} | ${displayName}`,
                        fillStyle: dataset.borderColor, // цвет квадрата рядом с текстом
                        hidden: !chart.isDatasetVisible(i),
                        lineCap: dataset.borderCapStyle,
                        lineDash: dataset.borderDash,
                        lineDashOffset: dataset.borderDashOffset,
                        lineJoin: dataset.borderJoinStyle,
                        lineWidth: dataset.borderWidth,
                        strokeStyle: dataset.borderColor,
                        pointStyle: dataset.pointStyle,
                        datasetIndex: i,
                      };
                    });
                  },
                },
              },
            },
            scales: {
              x: {
                type: 'time',
                min: start,
                max: removeRightPadding ? end : new Date(end.getTime() + 2 * 60 * 1000),
                time: {
                  unit: 'minute',
                  stepSize: 5,
                  tooltipFormat: 'DD.MM.YY HH:mm',
                  displayFormats: { minute: 'HH:mm' },
                },
                ticks: {
                  source: 'auto',
                  autoSkip: true,
                  maxTicksLimit: 24,
                  maxRotation: 0,
                  minRotation: 0,
                  font: {
                    size: 14, // Увеличение размера шрифта меток
                  },
                },
              },
              y: {
                min: yAxisConfig.min,
                max: yAxisConfig.max,
                ticks: {
                  stepSize: yAxisConfig.stepSize,
                  font: {
                    size: 13,
                  },
                },
                title: {
                  display: true,
                  text: yAxisConfig.title,
                  font: {
                    size: 16, // Увеличение шрифта
                  },
                },
              },
            },
          },
          plugins: [createCrosshairPlugin(), chartAreaBorderPlugin()],
        });
        toggleChartData(isDataVisible);
      } else {
        // Обновление данных и диапазона времени для существующего графика
        Object.keys(chartData).forEach((key, i) => {
          const dataset = chartInstance.data.datasets.find((ds) => ds.label === key);
          if (dataset) dataset.data = chartData[key];
        });
        chartInstance.options.scales.x.min = start;
        chartInstance.options.scales.x.max = removeRightPadding ? end : new Date(end.getTime() + 2 * 60 * 1000);
        chartInstance.update();
      }

      if (!isAutoUpdate) hidePreloader(elements);
    } catch (error) {
      console.error('Ошибка рендеринга графика:', error);
      if (!isAutoUpdate) hidePreloader(elements);
      showNoDataMessage(elements, chartInstance);
      destroyChart();
    }
  }

  // Функция для переключения видимости данных на графике
  function toggleChartData(visible) {
    if (!chartInstance) return;
    chartInstance.data.datasets.forEach((dataset, index) => {
      chartInstance.getDatasetMeta(index).hidden = !visible;
    });
    chartInstance.update();
  }

  // Функция для сброса графика
  function resetChart() {
    destroyChart();
  }

  // Функция для удаления графика
  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  // Функция для получения значения по метке
  function getValueByLabel(item, label) {
    if (item.temperatures && item.temperatures[label] !== undefined) return item.temperatures[label];
    if (item.pressures && item.pressures[label] !== undefined) return parseFloat(item.pressures[label]);
    if (item.vacuums && item.vacuums[label] !== undefined) return parseFloat(item.vacuums[label]);
    return null;
  }

  return {
    renderChart,
    toggleChartData,
    resetChart,
  };
}
