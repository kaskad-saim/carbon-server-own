import express from 'express';
import { Mill1Model } from '../models/millModel.js';
import logger from '../logger.js';

const router = express.Router();

// Роут для получения данных Mill1
router.get('/mill1-data', async (req, res) => {
  try {
    const data = await Mill1Model.find().sort({ lastUpdated: -1 }).limit(1); // Получаем последние данные
    if (!data[0]) {
      return res.status(404).json({ message: 'Данные не найдены' });
    }

    const lastUpdated = new Date(data[0].lastUpdated);
    const currentTime = new Date();

    // Проверка актуальности данных
    const isDataOutdated = currentTime - lastUpdated > 60000; // 60000 мс = 1 минута

    // Если данные устарели, заменяем их на прочерки
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
    logger.error('Ошибка при получении данных Mill1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Функция для замены всех значений в объекте на прочерк
const mapValuesToDash = (obj) => {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));
};

export default router;
