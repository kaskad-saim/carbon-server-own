// services/reportService.js
import { imDE093Model, imDD972Model, imDD973Model, imDD576Model, imDD569Model, imDD923Model, imDD924Model } from '../models/uzliUchetaModel.js';

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
  const timeRanges = [...Array(24).keys()].map(hour => {
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
      const filteredData = modelData.filter(entry => {
        const entryTime = new Date(entry.lastUpdated);
        return entryTime >= startTime && entryTime < endTime;
      });

      if (filteredData.length === 0) {
        return {
          time: label,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Предполагается, что "Гкал/ч" существует в data
      const gkalValues = filteredData.map(entry => entry.data.get('Гкал/ч ' + modelKey));

      // Если нет значений, ставим дефис
      if (gkalValues.length === 0) {
        return {
          time: label,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Рассчитываем среднее значение "Гкал/ч" за временной интервал
      const sum = gkalValues.reduce((acc, value) => acc + value, 0);
      const average = (sum / gkalValues.length).toFixed(2);

      return {
        time: label,
        model: modelKey,
        "Гкал/ч": average,
      };
    });

    reportData.push(hourlyData);
  }

  // Организуем данные для таблицы
  const tableData = timeRanges.map(({ label }) => {
    const row = { time: label };
    reportData.forEach(modelData => {
      const modelDataForTime = modelData.find(item => item.time === label);
      row[modelDataForTime.model] = modelDataForTime["Гкал/ч"];
    });
    return row;
  });

  return tableData;
};


export const getMonthReportData = async (month) => {
  // Разделяем месяц на год и номер месяца (формат: YYYY-MM)
  const [year, monthNumber] = month.split('-').map(Number);

  if (!year || !monthNumber) {
    throw new Error('Некорректный формат месяца. Ожидается YYYY-MM.');
  }

  // Начало месяца
  const startOfMonth = new Date(year, monthNumber - 1, 1);
  startOfMonth.setHours(0, 0, 0, 0);

  // Конец месяца (последний день)
  const endOfMonth = new Date(year, monthNumber, 0);
  endOfMonth.setHours(23, 59, 59, 999);

  // Создаем временные интервалы (по дням)
  const daysInMonth = Array.from({ length: endOfMonth.getDate() }, (_, i) => {
    const startTime = new Date(year, monthNumber - 1, i + 1, 0, 0, 0, 0);
    const endTime = new Date(year, monthNumber - 1, i + 1, 23, 59, 59, 999);
    const label = String(i + 1).padStart(2, '0'); // Формат "01", "02", ...
    return { startTime, endTime, label };
  });

  const reportData = [];

  // Для каждой модели получаем данные
  for (const modelKey in modelsMap) {
    const model = modelsMap[modelKey];
    const modelData = await model.find({ lastUpdated: { $gte: startOfMonth, $lt: endOfMonth } });

    // Для каждого дня извлекаем значение "Гкал/ч"
    const dailyData = daysInMonth.map(({ startTime, endTime, label }) => {
      const filteredData = modelData.filter(entry => {
        const entryTime = new Date(entry.lastUpdated);
        return entryTime >= startTime && entryTime <= endTime;
      });

      if (filteredData.length === 0) {
        return {
          day: label,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Предполагается, что "Гкал/ч" существует в data
      const gkalValues = filteredData.map(entry => entry.data.get('Гкал/ч ' + modelKey));

      // Если нет значений, ставим дефис
      if (gkalValues.length === 0) {
        return {
          day: label,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Рассчитываем среднее значение "Гкал/ч" за день
      const sum = gkalValues.reduce((acc, value) => acc + value, 0);
      const average = (sum / gkalValues.length).toFixed(2);

      return {
        day: label,
        model: modelKey,
        "Гкал/ч": average,
      };
    });

    reportData.push(dailyData);
  }

  // Организуем данные для таблицы
  const tableData = daysInMonth.map(({ label }) => {
    const row = { day: label };
    reportData.forEach(modelData => {
      const modelDataForDay = modelData.find(item => item.day === label);
      if (modelDataForDay) {
        row[modelDataForDay.model] = modelDataForDay["Гкал/ч"];
      } else {
        row[modelKey] = '-';
      }
    });
    return row;
  });

  return tableData;
};




