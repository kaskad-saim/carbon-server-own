import express from 'express';
import { Notis1Model } from '../models/notisModel.js';
import logger from '../logger.js';

const router = express.Router();

router.get('/notis1-data', async (req, res) => {
  try {
    const data = await Notis1Model.find().sort({ lastUpdated: -1 }).limit(1);
    if (!data[0]) {
      return res.status(404).json({ message: 'Данные не найдены' });
    }

    const lastUpdated = new Date(data[0].lastUpdated);
    const currentTime = new Date();

    const isDataOutdated = currentTime - lastUpdated > 180000; // 3 минуты

    const responseData = isDataOutdated
      ? {
          data: mapValuesToDash(data[0].data),
          status: 'outdated',
          lastUpdated: formatDate(data[0].lastUpdated),
        }
      : {
          ...data[0]._doc,
          lastUpdated: formatDate(data[0].lastUpdated),
        };

    res.json(responseData);
  } catch (err) {
    logger.error('Ошибка при получении данных Notis1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});


// Утилиты
const mapValuesToDash = (obj) =>
  Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));

const formatDate = (date) =>
  new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export default router;
