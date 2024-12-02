import { createChart } from '../components/chartRendererHourMpa.js';
import { getLastHoursRange } from '../components/dataUtils.js';
import { dataLabelsMpa2, dataLabelsMpa3 } from '../components/data.js';
import { setupInactivityTimer } from '../components/timer.js';

let serverTimeOffset = 0;

// Функция для синхронизации времени с сервером
async function syncServerTime() {
  try {
    const response = await fetch('/api/server-time'); // Эндпоинт на сервере для получения текущего времени
    const serverData = await response.json(); // Ожидаем { time: "2024-11-19T12:00:00Z" }
    const serverDate = new Date(serverData.time);
    const localDate = new Date();
    serverTimeOffset = serverDate.getTime() - localDate.getTime();
    console.log('Смещение времени с сервером:', serverTimeOffset, 'мс');
  } catch (error) {
    console.error('Ошибка синхронизации времени с сервером:', error);
  }
}

// Функция для получения скорректированного времени
function getCorrectedTime(date) {
  return new Date(date.getTime() + serverTimeOffset);
}

// Универсальная функция для инициализации графиков
function initializeChart(type, dataType, elements, chartTitle) {
  let isUserInteracting = false;
  let isDataVisible = true;
  let isRealTime = true;
  let currentStartTime, currentEndTime;

  const dataLabels = type === 'mpa2' ? dataLabelsMpa2 : dataLabelsMpa3;
  const labels = dataLabels[dataType];
  const units = labels.map(() => (dataType === 'temperatures' ? '°C' : 'кгс/м2'));

  const yAxisConfig =
    dataType === 'temperatures'
      ? { min: 0, max: 1200, stepSize: 100, title: 'Температура (°C)' }
      : { min: -30, max: 185, stepSize: 5, title: 'Давление/разрежение (кгс/м2)' };

  const chart = createChart({
    parameterType: type,
    elements,
    labels,
    units,
    yAxisConfig,
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
    currentStartTime = getCorrectedTime(start);
    currentEndTime = getCorrectedTime(end);
    renderGraphic(currentStartTime, currentEndTime);
  });

  // Инициализация графика при загрузке
  const { start, end } = getLastHoursRange();
  currentStartTime = getCorrectedTime(start);
  currentEndTime = getCorrectedTime(end);
  renderGraphic(currentStartTime, currentEndTime);

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
      currentStartTime = getCorrectedTime(start);
      currentEndTime = getCorrectedTime(end);
      renderGraphic(currentStartTime, currentEndTime, true);
    }
  }, 2000);
}

// Инициализация графиков
document.addEventListener('DOMContentLoaded', async () => {
  await syncServerTime();

  const configs = [
    { type: 'mpa2', dataType: 'temperatures', elementsIdPrefix: '1', chartTitle: 'График температур МПА2' },
    { type: 'mpa3', dataType: 'temperatures', elementsIdPrefix: '2', chartTitle: 'График температур МПА3' },
    { type: 'mpa2', dataType: 'pressures', elementsIdPrefix: '3', chartTitle: 'График давления/разрежения МПА2' },
    { type: 'mpa3', dataType: 'pressures', elementsIdPrefix: '4', chartTitle: 'График давления/разрежения МПА3' },
  ];

  configs.forEach(({ type, dataType, elementsIdPrefix, chartTitle }) => {
    const elements = {
      chartCanvas: document.getElementById(`chartCanvas${elementsIdPrefix}`),
      loadingWrapper: document.getElementById(`loadingWrapper${elementsIdPrefix}`),
      noDataMessage: document.getElementById(`noDataMessage${elementsIdPrefix}`),
      backwardBtn: document.getElementById(`backwardBtn${elementsIdPrefix}`),
      forwardBtn: document.getElementById(`forwardBtn${elementsIdPrefix}`),
      resetBtn: document.getElementById(`resetBtn${elementsIdPrefix}`),
      toggleDataBtn: document.getElementById(`toggleDataBtn${elementsIdPrefix}`),
    };

    if (elements.chartCanvas) {
      initializeChart(type, dataType, elements, chartTitle);
    }
  });

  // Периодически синхронизируем время
  setInterval(syncServerTime, 5 * 60 * 1000); // Повторяем каждые 5 минут
});
