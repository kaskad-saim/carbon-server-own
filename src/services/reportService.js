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

const calculateAverage = (data) => {
  // Проверяем, что data — это экземпляр Map
  if (data instanceof Map) {
    // Извлекаем только числовые значения из Map
    const values = Array.from(data.values()).filter(value => typeof value === 'number');

    // Если в Map нет числовых значений, возвращаем дефис
    if (values.length === 0) {
      return '-';
    }

    // Рассчитываем среднее значение
    const sum = values.reduce((acc, value) => acc + value, 0);
    const average = (sum / values.length).toFixed(2);

    return average;
  }

  // В случае, если передано не Map, просто возвращаем дефис
  return '-';
};


export const getDailyReportData = async (date) => {
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const hours = [...Array(24).keys()]; // Массив для всех часов с 00:00 по 23:00
  const reportData = [];

  // Для каждого объекта (модели) получаем данные
  for (const modelKey in modelsMap) {
    const model = modelsMap[modelKey];
    const modelData = await model.find({ lastUpdated: { $gte: startOfDay, $lt: endOfDay } });

    // Для каждого часа извлекаем значение "Гкал/ч"
    const hourlyData = hours.map(hour => {
      const time = `${String(hour).padStart(2, '0')}:00`;
      const filteredData = modelData.filter(entry => new Date(entry.lastUpdated).getHours() === hour);

      if (filteredData.length === 0) {
        return {
          time,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Предполагается, что "Гкал/ч" существует в data
      const gkalValues = filteredData.map(entry => entry.data.get('Гкал/ч ' + modelKey));

      // Если нет значений, ставим дефис
      if (gkalValues.length === 0) {
        return {
          time,
          model: modelKey,
          "Гкал/ч": '-',
        };
      }

      // Рассчитываем среднее значение "Гкал/ч" за час
      const sum = gkalValues.reduce((acc, value) => acc + value, 0);
      const average = (sum / gkalValues.length).toFixed(2);

      return {
        time,
        model: modelKey,
        "Гкал/ч": average,
      };
    });

    reportData.push(hourlyData);
  }

  // Организуем данные для таблицы
  const tableData = hours.map(hour => {
    const row = { time: `${String(hour).padStart(2, '0')}:00` };
    reportData.forEach(modelData => {
      const modelDataForHour = modelData.find(item => item.time === row.time);
      row[modelDataForHour.model] = modelDataForHour["Гкал/ч"];
    });
    return row;
  });

  return tableData;
};

