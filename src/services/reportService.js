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

// Универсальная функция для получения данных по устройствам
const fetchDeviceData = async (model, startOfDay, endOfDay) => {
  const data = await model.find({ lastUpdated: { $gte: startOfDay, $lt: endOfDay } });
  return data.reduce((acc, entry) => {
    const time = new Date(entry.lastUpdated).toISOString();
    const value = entry.data.get('Гкал/ч ' + model.modelName);
    if (value !== undefined && value !== null) {
      acc.push({ time, value: parseFloat(value) });
    }
    return acc;
  }, []);
};

// Универсальная функция для расчета среднего значения
const calculateAverageForInterval = (data, startTime, endTime) => {
  const values = data.filter(({ time }) => {
    const entryTime = new Date(time);
    return entryTime >= startTime && entryTime < endTime;
  }).map(({ value }) => value);

  if (values.length === 0) return '-';
  const sum = values.reduce((acc, val) => acc + val, 0);
  return (sum / values.length).toFixed(2);
};

// Генерация данных за день
export const getDayReportData = async (date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(startOfDay);
  endOfDay.setDate(endOfDay.getDate() + 1);

  const timeRanges = Array.from({ length: 24 }, (_, hour) => {
    const startTime = new Date(startOfDay);
    startTime.setHours(hour, 0, 0, 0);
    const endTime = new Date(startOfDay);
    endTime.setHours(hour + 1, 0, 0, 0);
    return { startTime, endTime, label: hour === 23 ? '24:00' : `${hour + 1}:00` };
  });

  const reportData = await Promise.all(
    Object.entries(modelsMap).map(async ([modelKey, model]) => {
      const deviceData = await fetchDeviceData(model, startOfDay, endOfDay);
      return timeRanges.map(({ startTime, endTime, label }) => ({
        time: label,
        model: modelKey,
        'Гкал/ч': calculateAverageForInterval(deviceData, startTime, endTime),
      }));
    })
  );

  return timeRanges.map(({ label }) => {
    const row = { time: label };
    reportData.flat().forEach(({ time, model, 'Гкал/ч': value }) => {
      if (time === label) row[model] = value;
    });
    return row;
  });
};

// Генерация данных за месяц
export const getMonthReportData = async (month) => {
  const [year, monthNumber] = month.split('-').map(Number);
  if (!year || !monthNumber) throw new Error('Некорректный формат месяца. Ожидается YYYY-MM.');

  const startOfMonth = new Date(year, monthNumber - 1, 1);
  const endOfMonth = new Date(year, monthNumber, 0);

  const allDays = Array.from(
    { length: endOfMonth.getDate() },
    (_, day) => new Date(year, monthNumber - 1, day + 1).toISOString().slice(0, 10)
  );

  const dailyReports = await DailyReportModel.find({
    date: { $gte: startOfMonth.toISOString().slice(0, 10), $lte: endOfMonth.toISOString().slice(0, 10) },
  });

  const reportMap = dailyReports.reduce((map, report) => {
    map[report.date] = report.data;
    return map;
  }, {});

  const reportData = allDays.map((day) => ({
    day,
    ...reportMap[day] || Object.fromEntries(Object.keys(modelsMap).map((key) => [key, '-'])),
  }));

  return applyCorrections(reportData, `${year}-${String(monthNumber).padStart(2, '0')}`);
};

// Применение коррекций
const applyCorrections = async (reportData, month) => {
  const corrections = await ReportCorrection.find({ day: { $regex: `^${month}` } });

  corrections.forEach(({ day, model, correctedValue }) => {
    const dayData = reportData.find((entry) => entry.day === day);
    if (dayData) dayData[model] = correctedValue;
  });

  return reportData;
};

// Генерация суточного отчета
export const generateDailyReport = async (date) => {
  const reportData = await getDayReportData(date);
  const totalData = calculateDailyTotals(reportData);

  await DailyReportModel.updateOne(
    { date },
    { date, data: totalData },
    { upsert: true }
  );

  return totalData;
};

// Суммирование данных за день
const calculateDailyTotals = (reportData) => {
  return reportData.reduce((totals, row) => {
    Object.keys(modelsMap).forEach((key) => {
      if (row[key] !== '-' && !isNaN(parseFloat(row[key]))) {
        totals[key] = (totals[key] || 0) + parseFloat(row[key]);
      }
    });
    return totals;
  }, {});
};
