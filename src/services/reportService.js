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
import { ReportCorrection } from '../models/reportCorrection.js';
import logger from '../logger.js';
import { DailyReportModel } from '../models/dailyReportModel.js';

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

  const startOfMonth = `${year}-${String(monthNumber).padStart(2, '0')}-01`;
  const endOfMonth = new Date(year, monthNumber, 0).toISOString().split('T')[0]; // Последний день месяца

  const dailyReports = await DailyReportModel.find({
    date: { $gte: startOfMonth, $lte: endOfMonth },
  });

  if (dailyReports.length === 0) {
    return []; // Нет данных за месяц
  }

  const monthlyTotals = {
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  };

  const reportData = dailyReports.map((report) => {
    Object.keys(monthlyTotals).forEach((key) => {
      monthlyTotals[key] += report.data[key];
    });
    return { day: report.date, ...report.data };
  });

  return reportData;
};

export const generateDailyReport = async (date) => {
  const reportData = await getDayReportData(date);
  const totalData = calculateDailyTotals(reportData);

  // Округляем значения до сотых
  const roundedData = {};
  Object.keys(totalData).forEach((key) => {
    roundedData[key] = parseFloat(totalData[key].toFixed(2));
  });

  await DailyReportModel.updateOne(
    { date },
    { date, data: roundedData }, // Сохраняем округленные данные
    { upsert: true }
  );
  return roundedData; // Возвращаем округленные данные
};

const calculateDailyTotals = (reportData) => {
  const totals = {
    DE093: 0,
    DD972: 0,
    DD973: 0,
    DD576: 0,
    DD569: 0,
    DD923: 0,
    DD924: 0,
  };

  reportData.forEach((entry) => {
    Object.keys(totals).forEach((key) => {
      if (entry[key] !== '-' && !isNaN(parseFloat(entry[key]))) {
        totals[key] += parseFloat(entry[key]);
      }
    });
  });

  return totals;
};
