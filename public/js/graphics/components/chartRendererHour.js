import { showNoDataMessage, hideNoDataMessage, showPreloader, hidePreloader } from './uiUtils.js';
import { insertGapsInData, hasNoValidData } from './dataUtils.js';
import { createCrosshairPlugin, chartAreaBorderPlugin, colors } from './chartUtils.js';
import { fetchData } from './fetchData.js';

let chartInstance = null;

// Функция для рендеринга графика (часовой)
export async function renderChartHour(options, elements, isDataVisible) {
  const {
    parameterType,
    labels,
    units,
    yAxisConfig,
    chartTitle,
    start,
    end,
    isArchive = false,
    isAutoUpdate = false,
  } = options;

  try {
    if (!isAutoUpdate) showPreloader(elements);

    const data = await fetchData(parameterType, start, end);

    const selectedDate = start.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    // Формируем заголовок графика
    const fullChartTitle = isArchive && selectedDate ? `${chartTitle} за ${selectedDate}` : chartTitle;

    const chartData = {};
    let hasData = false;

    labels.forEach((label) => {
      const dataset = data.map((item) => {
        const value = getValueByLabel(item, label);
        return {
          x: new Date(item.lastUpdated),
          y: typeof value === 'number' ? value : null,
        };
      });

      const datasetWithGaps = insertGapsInData(dataset);
      chartData[label] = datasetWithGaps;

      if (!hasNoValidData(datasetWithGaps)) {
        hasData = true;
      }
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
                title: function (tooltipItems) {
                  const date = new Date(tooltipItems[0].parsed.x);
                  return date.toLocaleString('ru-RU', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  });
                },
                label: function (tooltipItem) {
                  const datasetLabel = tooltipItem.dataset.label || '';
                  const value = tooltipItem.parsed.y;
                  const datasetIndex = tooltipItem.datasetIndex;
                  const unit = units[datasetIndex] || '';
                  return `${datasetLabel}: ${value} ${unit}`;
                },
              },
            },
            title: {
              display: true,
              text: fullChartTitle,
              color: 'green',
              font: {
                size: 24,
                weight: 'bold',
              },
              padding: {
                top: 10,
                bottom: 10,
              },
              align: 'center',
            },
            legend: {
              position: 'right', // Размещаем легенду справа
              labels: {
                generateLabels: function (chart) {
                  return chart.data.datasets.map((dataset, i) => {
                    const lastVisiblePoint = dataset.data.filter((d) => d.y !== null).slice(-1)[0];
                    const lastValue = lastVisiblePoint ? lastVisiblePoint.y : '-';

                    return {
                      text: `${dataset.label}: ${lastValue}`, // Добавляем последнее значение к метке
                      fillStyle: dataset.borderColor,
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
              time: {
                unit: 'minute',
                stepSize: 5,
                tooltipFormat: 'HH:mm',
                displayFormats: {
                  minute: 'HH:mm',
                },
              },
              afterDataLimits: (scale) => {
                if (!isArchive) {
                  const rightPadding = 5 * 60 * 1000;
                  scale.max += rightPadding;
                }
              },
              ticks: {
                source: 'auto',
                maxRotation: 0,
                minRotation: 0,
                autoSkip: false,
              },
            },
            y: {
              min: yAxisConfig.min,
              max: yAxisConfig.max,
              ticks: {
                stepSize: yAxisConfig.stepSize,
              },
              title: {
                display: true,
                text: yAxisConfig.title,
              },
            },
          },
          layout: {
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          },
        },
        plugins: [createCrosshairPlugin(), chartAreaBorderPlugin()],
      });

      toggleChartData(isDataVisible);
    } else {
      Object.keys(chartData).forEach((key) => {
        const dataset = chartInstance.data.datasets.find((ds) => ds.label === key);
        if (dataset) {
          dataset.data = chartData[key];
        }
      });

      chartInstance.options.scales.y.min = yAxisConfig.min;
      chartInstance.options.scales.y.max = yAxisConfig.max;
      chartInstance.options.scales.y.ticks.stepSize = yAxisConfig.stepSize;
      chartInstance.options.scales.y.title.text = yAxisConfig.title;

      chartInstance.options.plugins.title.text = fullChartTitle;
      chartInstance.options.plugins.title.color = 'green';
      chartInstance.options.plugins.title.padding.bottom = 10;

      chartInstance.options.scales.x.afterDataLimits = (scale) => {
        if (!isArchive) {
          const rightPadding = 5 * 60 * 1000;
          scale.max += rightPadding;
        }
      };

      chartInstance.options.scales.x.time.unit = 'minute';
      chartInstance.options.scales.x.time.stepSize = 5;
      chartInstance.options.scales.x.time.displayFormats.minute = 'HH:mm';

      chartInstance.update();
    }

    if (!isAutoUpdate) hidePreloader(elements);
  } catch (error) {
    console.error('Ошибка создания графика:', error);
    if (!isAutoUpdate) hidePreloader(elements);
    showNoDataMessage(elements, chartInstance);
    destroyChart();
  }
}

// Функция для уничтожения графика
function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
}

// Функция для получения значения по метке
function getValueByLabel(item, label) {
  if (item.temperatures && item.temperatures[label] !== undefined) {
    return item.temperatures[label];
  }
  if (item.pressures && item.pressures[label] !== undefined) {
    return parseFloat(item.pressures[label]);
  }
  if (item.levels && item.levels[label]) {
    return item.levels[label].value;
  }
  if (item.vacuums && item.vacuums[label] !== undefined) {
    return parseFloat(item.vacuums[label]);
  }
  if (item.gorelka && item.gorelka[label] !== undefined) {
    return item.gorelka[label];
  }
  return null;
}

// Функция для переключения видимости данных на графике
export function toggleChartData(isDataVisible) {
  if (!chartInstance) return;

  chartInstance.data.datasets.forEach((dataset, index) => {
    chartInstance.getDatasetMeta(index).hidden = !isDataVisible;
  });

  chartInstance.update();
}

// Функция для сброса графика
export function resetChart() {
  destroyChart();
}
