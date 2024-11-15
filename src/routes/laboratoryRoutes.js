// laboratoryRoutes.js
import express from 'express';
import PechVr1LabModel from '../models/pechVr1LabData.js';
import PechVr2LabModel from '../models/pechVr2LabData.js';

const router = express.Router();

// Функция для обработки сохранения данных
const saveData = async (model, req, res) => {
  try {
    const { value, valuePH, valueSUM, time } = req.body;

    if (!time) {
      return res.status(400).json({ message: 'Необходимо указать время' });
    }

    if (!value && !valuePH && !valueSUM) {
      return res.status(400).json({ message: 'Необходимо указать хотя бы одно значение' });
    }

    const date = new Date().toLocaleDateString('ru-RU');

    const newData = new model({
      value: value ?? '-',
      valueTime: value ? time : '-',
      valueDate: value ? date : '-',

      valuePH: valuePH ?? '-',
      valuePHTime: valuePH ? time : '-',
      valuePHDate: valuePH ? date : '-',

      valueSUM: valueSUM ?? '-',
      valueSUMTime: valueSUM ? time : '-',
      valueSUMDate: valueSUM ? date : '-',

      recordTime: time,
      recordDate: date,
    });

    await newData.save();

    // Возвращаем последние известные значения для отображения в таблице последних значений
    const lastValueData = await model.findOne({ value: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValuePHData = await model.findOne({ valuePH: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValueSUMData = await model.findOne({ valueSUM: { $ne: '-' } }).sort({ createdAt: -1 }).lean();

    res.json({
      message: 'Данные успешно сохранены',
      value: lastValueData?.value || '-',
      valueTime: lastValueData?.valueTime || '-',
      valueDate: lastValueData?.valueDate || '-',
      valuePH: lastValuePHData?.valuePH || '-',
      valuePHTime: lastValuePHData?.valuePHTime || '-',
      valuePHDate: lastValuePHData?.valuePHDate || '-',
      valueSUM: lastValueSUMData?.valueSUM || '-',
      valueSUMTime: lastValueSUMData?.valueSUMTime || '-',
      valueSUMDate: lastValueSUMData?.valueSUMDate || '-',
    });
  } catch (error) {
    console.error('Ошибка при сохранении данных:', error);
    res.status(500).json({ message: 'Произошла ошибка при сохранении данных' });
  }
};

// Функция для получения последних данных
const getLastData = async (model, req, res) => {
  try {
    // Получаем последние записи для каждого параметра
    const lastValueData = await model.findOne({ value: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValuePHData = await model.findOne({ valuePH: { $ne: '-' } }).sort({ createdAt: -1 }).lean();
    const lastValueSUMData = await model.findOne({ valueSUM: { $ne: '-' } }).sort({ createdAt: -1 }).lean();

    res.json({
      value: lastValueData?.value || '-',
      valueTime: lastValueData?.valueTime || '-',
      valueDate: lastValueData?.valueDate || '-',
      valuePH: lastValuePHData?.valuePH || '-',
      valuePHTime: lastValuePHData?.valuePHTime || '-',
      valuePHDate: lastValuePHData?.valuePHDate || '-',
      valueSUM: lastValueSUMData?.valueSUM || '-',
      valueSUMTime: lastValueSUMData?.valueSUMTime || '-',
      valueSUMDate: lastValueSUMData?.valueSUMDate || '-',
    });
  } catch (error) {
    console.error('Ошибка при получении последних данных:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении данных' });
  }
};

// Функция для получения данных за последние 24 часа
const getLastDayData = async (model, req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const lastDayData = await model
      .find({ createdAt: { $gte: twentyFourHoursAgo } })
      .sort({ createdAt: -1 })
      .lean();

    res.json(
      lastDayData.map((item) => ({
        value: item.value || '-',
        valuePH: item.valuePH || '-',
        valueSUM: item.valueSUM || '-',
        recordTime: item.recordTime || '-',
        recordDate: item.recordDate || '-',
      }))
    );
  } catch (error) {
    console.error('Ошибка при получении данных за последние сутки:', error);
    res.status(500).json({ message: 'Произошла ошибка при получении данных' });
  }
};

// Обработка POST-запросов на /submit
router.post('/pechVr1/submit', (req, res) => saveData(PechVr1LabModel, req, res));
router.post('/pechVr2/submit', (req, res) => saveData(PechVr2LabModel, req, res));

// Обработка GET-запросов на /last
router.get('/pechVr1/last', (req, res) => getLastData(PechVr1LabModel, req, res));
router.get('/pechVr2/last', (req, res) => getLastData(PechVr2LabModel, req, res));

// Обработка GET-запросов на /last-day
router.get('/pechVr1/last-day', (req, res) => getLastDayData(PechVr1LabModel, req, res));
router.get('/pechVr2/last-day', (req, res) => getLastDayData(PechVr2LabModel, req, res));

export default router;
