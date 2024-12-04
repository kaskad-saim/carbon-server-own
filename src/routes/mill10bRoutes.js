import express from 'express';
import { Mill10bModel } from '../models/millModel.js';
import logger from '../logger.js';

const router = express.Router();

// Роут для получения данных Mill10b
router.get('/mill10b-data', async (req, res) => {
  try {
    const data = await Mill10bModel.find().sort({ lastUpdated: -1 }).limit(1);
    if (!data[0]) {
      return res.status(404).json({ message: 'Данные не найдены' });
    }

    const lastUpdated = new Date(data[0].lastUpdated);
    const currentTime = new Date();

    const isDataOutdated = currentTime - lastUpdated > 60000; // 1 минута

    const responseData = isDataOutdated
      ? {
          data: mapValuesToDash(data[0].data),
          lastUpdated: new Date(data[0].lastUpdated).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        }
      : {
          ...data[0]._doc,
          lastUpdated: new Date(data[0].lastUpdated).toLocaleString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };

    res.json(responseData);
  } catch (err) {
    logger.error('Ошибка при получении данных Mill10b:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Функция для замены всех значений на прочерки
const mapValuesToDash = (obj) => {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));
};

export default router;
