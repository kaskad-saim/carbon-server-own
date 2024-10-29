import express from 'express';
import { PechVr1Model } from '../models/pechVrModel.js';

const router = express.Router();

// Роут для получения данных VR1
router.get('/vr1-data', async (req, res) => {
  try {
    const data = await PechVr1Model.find().sort({ lastUpdated: -1 }).limit(1); // Получаем последние данные
    res.json(data[0]);
  } catch (err) {
    console.error('Ошибка при получении данных VR1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;


