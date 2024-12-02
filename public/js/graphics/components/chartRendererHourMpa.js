import { showNoDataMessage, hideNoDataMessage, showPreloader, hidePreloader } from './uiUtils.js';
import { insertGapsInData, hasNoValidData } from './dataUtils.js';
import { createCrosshairPlugin, chartAreaBorderPlugin, colors } from './chartUtils.js';
import { fetchData } from './fetchData.js';
import { displayNamesMpa2, displayNamesMpa3, displayNamesTooltipMpa2, displayNamesTooltipMpa3 } from './data.js';

export function createChart({
  parameterType,
  elements,
  labels,
  units,
  yAxisConfig,
  chartTitle
}) {
  let chartInstance = null;
  let isDataVisible = true;

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
                callbacks: {
                  label: function (tooltipItem) {
                    const datasetLabel = tooltipItem.dataset.label || '';
                    const value = tooltipItem.parsed.y;
                    const datasetIndex = tooltipItem.datasetIndex;
                    const unit = units[datasetIndex] || '';

                    // Получение "читаемого" имени из displayNamesMpa2 или displayNamesMpa3
                    const displayName =
                      displayNamesTooltipMpa2[datasetLabel] ||
                      displayNamesTooltipMpa3[datasetLabel] ||
                      datasetLabel;

                    return `${displayName}: ${value} ${unit}`;
                  },
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
                  font: { size: 13 },
                  generateLabels: function (chart) {
                    return chart.data.datasets.map((dataset, i) => {
                      const lastVisiblePoint = dataset.data.filter((d) => d.y !== null).slice(-1)[0];
                      const lastValue = lastVisiblePoint ? lastVisiblePoint.y : '-';
                      const unit = units[i] || '';
                      const displayName =
                        displayNamesMpa2[dataset.label] ||
                        displayNamesMpa3[dataset.label] ||
                        dataset.label;
                      return {
                        text: `${lastValue} ${unit} | ${displayName}`,
                        fillStyle: dataset.borderColor, // Цвет квадрата рядом с текстом
                        hidden: !chart.isDatasetVisible(i), // Текущая видимость набора данных
                        lineCap: dataset.borderCapStyle,
                        lineDash: dataset.borderDash,
                        lineDashOffset: dataset.borderDashOffset,
                        lineJoin: dataset.borderJoinStyle,
                        lineWidth: dataset.borderWidth,
                        strokeStyle: dataset.borderColor, // Цвет линии
                        pointStyle: dataset.pointStyle, // Стиль точки
                        datasetIndex: i, // Индекс набора данных
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
                  tooltipFormat: 'DD.MM.YY HH:mm',
                  displayFormats: { minute: 'HH:mm' },
                },
                ticks: {
                  stepSize: 2, // Шаг в 2 минуты
                  autoSkip: false, // Отключаем автоматическое пропускание меток
                  maxTicksLimit: Math.floor((end - start) / (60 * 1000)), // Ограничиваем число меток
                },
              },
              y: {
                min: yAxisConfig.min,
                max: yAxisConfig.max,
                ticks: { stepSize: yAxisConfig.stepSize },
                title: { display: true, text: yAxisConfig.title },
              },
            },
          },
          plugins: [createCrosshairPlugin(), chartAreaBorderPlugin()],
        });
        toggleChartData(isDataVisible);
      } else {
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

  function toggleChartData(visible) {
    if (!chartInstance) return;
    chartInstance.data.datasets.forEach((dataset, index) => {
      chartInstance.getDatasetMeta(index).hidden = !visible;
    });
    chartInstance.update();
  }

  function resetChart() {
    destroyChart();
  }

  function destroyChart() {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  function getValueByLabel(item, label) {
    if (item.temperatures && item.temperatures[label] !== undefined) return item.temperatures[label];
    if (item.pressures && item.pressures[label] !== undefined) return parseFloat(item.pressures[label]);
    return null;
  }

  return {
    renderChart,
    toggleChartData,
    resetChart,
  };
}

