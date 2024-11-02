import { renderChartHour, toggleChartData, resetChart } from '../components/chartRendererHour.js';
import { getLastHoursRange, getSingleDateRange, isToday } from '../components/dataUtils.js';
import { dataLabels } from '../components/data.js';
import { elements } from '../components/chartUtils.js';
import { setupInactivityTimer } from '../components/timer.js';

// Состояния
let isDataVisible = true;
let isArchiveMode = false;

// Функция для отображения графика
function renderGraphic(start, end, isArchive = false, isAutoUpdate = false) {
  renderChartHour(
    {
      parameterType: 'vr1',
      labels: dataLabels.levels,
      units: ['мм', '%', '%'], // Первая метка в мм, вторая в %
      yAxisConfig: {
        min: -200,
        max: 200,
        stepSize: 10,
        title: 'Уровень (мм)',
      },
      chartTitle: 'График уровня печи карбонизации №1',
      start,
      end,
      isArchive,
      isAutoUpdate,
    },
    elements,
    isDataVisible
  );
}

// Обработчики событий
elements.confirmDateBtn.addEventListener('click', () => {
  const { start, end } = getSingleDateRange(elements.singleDate.value);
  if (start && end) {
    if (isToday(start)) {
      isArchiveMode = false;
      const { start: last24Start, end: last24End } = getLastHoursRange();
      renderGraphic(last24Start, last24End, false);
    } else {
      isArchiveMode = true;
      renderGraphic(start, end, true);
    }
  } else {
    alert('Пожалуйста, выберите корректную дату.');
  }
});

elements.toggleDataBtn.addEventListener('click', () => {
  isDataVisible = !isDataVisible; // Сначала изменяем состояние
  toggleChartData(isDataVisible); // Затем вызываем функцию для изменения видимости данных
  elements.toggleDataBtn.textContent = isDataVisible ? 'Скрыть данные' : 'Показать данные'; // Обновляем текст кнопки
});

elements.resetBtn.addEventListener('click', () => {
  resetChart();
  location.reload();
});

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', () => {
  const today = new Date().toISOString().split('T')[0];
  elements.singleDate.value = today;

  const { start, end } = getLastHoursRange();
  renderGraphic(start, end, false);

  // Настройка таймера неактивности
  setupInactivityTimer(() => {
    if (isArchiveMode) {
      location.reload();
    }
  });

  // Автообновление графика каждые 60 секунд
  setInterval(() => {
    if (!isArchiveMode) {
      const { start, end } = getLastHoursRange();
      renderGraphic(start, end, false, true);
    }
  }, 2000);
});
