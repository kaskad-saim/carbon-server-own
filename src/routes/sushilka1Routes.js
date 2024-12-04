import express from 'express';
import { Sushilka1Model } from '../models/sushilkaModel.js';
import logger from '../logger.js';

const router = express.Router();

// Роут для получения последних данных для Sushilka1
router.get('/sushilka1-data', async (req, res) => {
  try {
    const data = await Sushilka1Model.find().sort({ lastUpdated: -1 }).limit(1); // Получаем последние данные
    if (!data[0]) {
      return res.status(404).json({ message: 'Данные не найдены' });
    }

    const lastUpdated = new Date(data[0].lastUpdated);
    const currentTime = new Date();

    // Проверка, устарели ли данные
    const isDataOutdated = currentTime - lastUpdated > 60000; // 60000 мс = 1 минута

    // Формируем ответ, заменяя устаревшие значения на прочерки
    const responseData = isDataOutdated
      ? {
          temperatures: mapValuesToDash(data[0].temperatures),
          vacuums: mapValuesToDash(data[0].vacuums),
          gorelka: mapValuesToDash(data[0].gorelka),
          im: mapValuesToDash(data[0].im),
          lastUpdated: lastUpdated.toLocaleString('ru-RU', {
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
          lastUpdated: lastUpdated.toLocaleString('ru-RU', {
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
    logger.error('Ошибка при получении данных для Sushilka1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Функция для замены всех значений в объекте на прочерк
const mapValuesToDash = (obj) => {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));
};

export default router;
