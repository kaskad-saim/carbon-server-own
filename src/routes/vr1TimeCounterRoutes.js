import express from 'express';
import { Vr1TimeCounterModel } from '../models/vr1TimeCounterModel.js';
import logger from '../logger.js';

const router = express.Router();

router.get('/vr1-time', async (req, res) => {
  try {
    const data = await Vr1TimeCounterModel.findOne().sort({ lastUpdated: -1 });
    if (!data) {
      return res.status(404).json({ message: 'Данные не найдены' });
    }

    const currentTime = new Date();
    const isOutdated = (currentTime - data.lastUpdated) > 60000; // 1 минута

    res.json({
      currentTime: isOutdated ? '--:--:--' : data.currentTime,
      lastUpdated: data.lastUpdated.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    });
  } catch (err) {
    logger.error('Ошибка получения времени VR1:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;