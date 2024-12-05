// services/reportService.js
import {
  imDE093Model,
  imDD972Model,
  imDD973Model,
  imDD576Model,
  imDD569Model,
  imDD923Model,
  imDD924Model,
} from '../models/uzliUchetaModel.js';

const modelsMap = {
  DE093: imDE093Model,
  DD972: imDD972Model,
  DD973: imDD973Model,
  DD576: imDD576Model,
  DD569: imDD569Model,
  DD923: imDD923Model,
  DD924: imDD924Model,
};

export const getDayReportData = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setDate(endOfDay.getDate() + 1);
  endOfDay.setHours(0, 0, 0, 0);

  // Создаем временные интервалы
  const timeRanges = [...Array(24).keys()].map((hour) => {
    let startTime = new Date(startOfDay);
    startTime.setHours(hour, 0, 0, 0);
    let endTime = new Date(startOfDay);
    let label;

    if (hour === 23) {
      // Последний интервал: 23:00 - 24:00
      endTime = new Date(endOfDay); // Устанавливаем конец на начало следующего дня
      label = '24:00';
    } else {
      endTime.setHours(hour + 1, 0, 0, 0);
      label = `${String(hour + 1).padStart(2, '0')}:00`;
    }
    return { startTime, endTime, label };
  });

  const reportData = [];

  // Для каждого объекта (модели) получаем данные
  for (const modelKey in modelsMap) {
    const model = modelsMap[modelKey];
    const modelData = await model.find({ lastUpdated: { $gte: startOfDay, $lt: endOfDay } });

    // Для каждого временного интервала извлекаем значение "Гкал/ч"
    const hourlyData = timeRanges.map(({ startTime, endTime, label }) => {
      const filteredData = modelData.filter((entry) => {
        const entryTime = new Date(entry.lastUpdated);
        return entryTime >= startTime && entryTime < endTime;
      });

      if (filteredData.length === 0) {
        return {
          time: label,
          model: modelKey,
          'Гкал/ч': '-',
        };
      }

      // Предполагается, что "Гкал/ч" существует в data
      const gkalValues = filteredData.map((entry) => {
        const value = entry.data.get('Гкал/ч ' + modelKey);
        return value !== undefined && value !== null ? parseFloat(value) : 0; // Заменяем некорректные значения на 0
      });

      // Если массив пуст, возвращаем дефис
      if (gkalValues.length === 0) {
        return {
          time: label,
          model: modelKey,
          'Гкал/ч': '-',
        };
      }

      // Проверяем корректность суммы
      const sum = gkalValues.reduce((acc, value) => acc + value, 0);
      const average = gkalValues.length > 0 ? (sum / gkalValues.length).toFixed(2) : '-';

      return {
        time: label,
        model: modelKey,
        'Гкал/ч': average,
      };
    });

    reportData.push(hourlyData);
  }

  // Организуем данные для таблицы
  const tableData = timeRanges.map(({ label }) => {
    const row = { time: label };
    reportData.forEach((modelData) => {
      const modelDataForTime = modelData.find((item) => item.time === label);
      row[modelDataForTime.model] = modelDataForTime['Гкал/ч'];
    });
    return row;
  });

  return tableData;
};

export const getMonthReportData = async (month) => {
  const [year, monthNumber] = month.split('-').map(Number);

  if (!year || !monthNumber) {
    throw new Error('Некорректный формат месяца. Ожидается YYYY-MM.');
  }

  const startOfMonth = new Date(year, monthNumber - 1, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date(year, monthNumber, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
    const date = new Date(year, monthNumber - 1, i + 1).toISOString().split('T')[0];
    return date; // Массив дат в формате YYYY-MM-DD
  });

  const reportData = [];

  for (const day of daysInMonth) {
    // Получаем данные за каждый день, используя `getDayReportData`
    const dayData = await getDayReportData(day);

    // Суммируем значения за каждый час по каждой модели
    const dailyTotals = {};
    dayData.forEach((row) => {
      for (const [model, value] of Object.entries(row)) {
        if (model === 'time') continue; // Пропускаем колонку времени
        if (!dailyTotals[model]) dailyTotals[model] = 0;

        // Суммируем только числовые значения
        const numericValue = value === '-' ? 0 : parseFloat(value);
        dailyTotals[model] += numericValue;
      }
    });

    // Округляем значения до 2 знаков после запятой
    for (const model in dailyTotals) {
      dailyTotals[model] = parseFloat(dailyTotals[model].toFixed(2));
    }

    // Форматируем итоговые данные за день
    reportData.push({ day, ...dailyTotals });
  }

  // Итоги за месяц
  const monthTotals = {};
  reportData.forEach((dailyData) => {
    for (const [model, value] of Object.entries(dailyData)) {
      if (model === 'day') continue; // Пропускаем колонку с датой
      if (!monthTotals[model]) monthTotals[model] = 0;

      monthTotals[model] += value;
    }
  });

  // Округляем итоги за месяц
  for (const model in monthTotals) {
    monthTotals[model] = parseFloat(monthTotals[model].toFixed(2));
  }

  return reportData;
};

