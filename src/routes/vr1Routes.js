import express from 'express';
import { PechVr1Model } from '../models/pechVrModel.js';

const router = express.Router();

// Роут для получения данных VR1
router.get('/vr1-data', async (req, res) => {
  try {
    const data = await PechVr1Model.find().sort({ lastUpdated: -1 }).limit(1); // Получаем последние данные
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
          temperatures: mapValuesToDash(data[0].temperatures),
          levels: mapValuesToDash(data[0].levels),
          pressures: mapValuesToDash(data[0].pressures),
          vacuums: mapValuesToDash(data[0].vacuums),
          im: mapValuesToDash(data[0].im),
          gorelka: mapValuesToDash(data[0].gorelka),
          lastUpdated: data[0].lastUpdated,
        }
      : data[0];

    res.json(responseData);
  } catch (err) {
    console.error('Ошибка при получении данных VR1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Функция для замены всех значений в объекте на прочерк
const mapValuesToDash = (obj) => {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));
};

export default router;
