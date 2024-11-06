import { createChart } from '../components/chartRendererHour.js';
import { getLastHoursRange } from '../components/dataUtils.js';
import { dataLabels } from '../components/data.js';
import { setupInactivityTimer } from '../components/timer.js';

// Функция для инициализации графика
function initializeChart(parameterType, elements, chartTitle) {
  let isUserInteracting = false;
  let isDataVisible = true;
  let isRealTime = true;
  let currentStartTime, currentEndTime;

  const chart = createChart({
    parameterType,
    elements,
    labels: dataLabels.temperatures,
    units: dataLabels.temperatures.map(() => '°C'),
    yAxisConfig: {
      min: 0,
      max: 1500,
      stepSize: 100,
      title: 'Температура (°C)',
    },
    chartTitle,
  });

  // Функция для отображения графика
  function renderGraphic(start, end, isAutoUpdate = false) {
    chart.renderChart(start, end, isAutoUpdate, !isRealTime);
  }

  // Обработчики событий для кнопок управления
  elements.backwardBtn.addEventListener('click', () => {
    isUserInteracting = true;
    isRealTime = false;
    currentEndTime = new Date(currentStartTime);
    currentStartTime = new Date(currentStartTime.getTime() - 1 * 60 * 60 * 1000);
    renderGraphic(currentStartTime, currentEndTime);
  });

  elements.forwardBtn.addEventListener('click', () => {
    const { end: currentEnd } = getLastHoursRange();
    currentStartTime = new Date(currentStartTime.getTime() + 1 * 60 * 60 * 1000);
    currentEndTime = new Date(currentEndTime.getTime() + 1 * 60 * 60 * 1000);

    if (currentEndTime >= currentEnd) {
      isUserInteracting = false;
      isRealTime = true;
      renderGraphic(currentStartTime, currentEndTime);
    } else {
      isUserInteracting = true;
      renderGraphic(currentStartTime, currentEndTime);
    }
  });

  elements.toggleDataBtn.addEventListener('click', () => {
    isDataVisible = !isDataVisible;
    chart.toggleChartData(isDataVisible);
    elements.toggleDataBtn.textContent = isDataVisible ? 'Скрыть данные' : 'Показать данные';
  });

  elements.resetBtn.addEventListener('click', () => {
    chart.resetChart();
    isUserInteracting = false;
    isRealTime = true;
    const { start, end } = getLastHoursRange();
    currentStartTime = start;
    currentEndTime = end;
    renderGraphic(start, end);
  });

  // Инициализация графика при загрузке
  const { start, end } = getLastHoursRange();
  currentStartTime = start;
  currentEndTime = end;
  renderGraphic(start, end);

  // Настройка таймера неактивности
  setupInactivityTimer(() => {
    if (isUserInteracting) {
      isUserInteracting = false;
      isRealTime = true;
      renderGraphic(currentStartTime, currentEndTime);
    }
  });

  // Автообновление графика каждые 2 секунды, если в режиме реального времени
  setInterval(() => {
    if (!isUserInteracting && isRealTime) {
      const { start, end } = getLastHoursRange();
      currentStartTime = start;
      currentEndTime = end;
      renderGraphic(start, end, true);
    }
  }, 2000);
}

// Инициализация графиков в зависимости от их наличия
document.addEventListener('DOMContentLoaded', () => {
  const elements1 = {
    chartCanvas: document.getElementById('chartCanvas1'),
    loadingWrapper: document.getElementById('loadingWrapper1'),
    noDataMessage: document.getElementById('noDataMessage1'),
    backwardBtn: document.getElementById('backwardBtn1'),
    forwardBtn: document.getElementById('forwardBtn1'),
    resetBtn: document.getElementById('resetBtn1'),
    toggleDataBtn: document.getElementById('toggleDataBtn1'),
  };

  if (elements1.chartCanvas) {
    initializeChart('vr1', elements1, 'График температур печи карбонизации №1');
  }

  const elements2 = {
    chartCanvas: document.getElementById('chartCanvas2'),
    loadingWrapper: document.getElementById('loadingWrapper2'),
    noDataMessage: document.getElementById('noDataMessage2'),
    backwardBtn: document.getElementById('backwardBtn2'),
    forwardBtn: document.getElementById('forwardBtn2'),
    resetBtn: document.getElementById('resetBtn2'),
    toggleDataBtn: document.getElementById('toggleDataBtn2'),
  };

  if (elements2.chartCanvas) {
    initializeChart('vr2', elements2, 'График температур печи карбонизации №2');
  }
});
