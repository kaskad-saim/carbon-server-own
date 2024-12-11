import express from 'express';
import rateLimit from 'express-rate-limit';
import { getDayReportData, getMonthReportData } from '../services/reportService.js';
import { ReportCorrection } from '../models/reportCorrection.js';
import logger from '../logger.js';

const router = express.Router();

// Конфигурация пароля для коррекций
const CORRECTION_PASSWORD = process.env.CORRECTION_PASSWORD || '123'; // Используйте переменные окружения

// Лимитер для предотвращения атак перебора
const correctionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 10, // Максимум 10 попыток за окно
  message: 'Слишком много попыток. Пожалуйста, попробуйте позже.',
});

// Получение данных за день
router.get('/getReportDataDay', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Дата не указана' });
  }

  try {
    const reportData = await getDayReportData(date);
    res.json(reportData);
  } catch (err) {
    logger.error('Ошибка при получении данных:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// Получение данных за месяц
router.get('/getReportDataMonth', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Месяц не указан.' });
  }

  try {
    const reportData = await getMonthReportData(month);
    res.json(reportData);
  } catch (err) {
    logger.error(`Ошибка при получении данных за месяц: ${err.message}`, err.stack); // Более подробный лог
    res.status(500).json({ error: 'Ошибка сервера при получении данных за месяц.', details: err.message });
  }
});

// Сохранение коррекций
router.post('/correctReportData', correctionLimiter, async (req, res) => {
  const { modifications, password } = req.body;

  if (!modifications || !Array.isArray(modifications)) {
    return res.status(400).json({ error: 'Некорректные данные для коррекции.' });
  }

  if (password !== CORRECTION_PASSWORD) {
    return res.status(401).json({ error: 'Неверный пароль.' });
  }

  try {
    const bulkOps = modifications.map((mod) => {
      const { day, model, value } = mod;

      return {
        updateOne: {
          filter: { day, model },
          update: { correctedValue: value, correctedAt: new Date() },
          upsert: true,
        },
      };
    });

    await ReportCorrection.bulkWrite(bulkOps);

    res.json({ message: 'Изменения сохранены успешно.' });
  } catch (err) {
    logger.error('Ошибка при сохранении изменений:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера при сохранении изменений.', details: err.message });
  }
});

// Получение коррекций за месяц
router.get('/getReportCorrections', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Месяц не указан.' });
  }

  try {
    const [year, monthNumber] = month.split('-').map(Number);
    if (!year || !monthNumber) {
      return res.status(400).json({ error: 'Некорректный формат месяца.' });
    }

    const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
    const endDate = new Date(Date.UTC(year, monthNumber, 0));

    const corrections = await ReportCorrection.find({
      day: {
        $gte: startDate.toISOString().slice(0, 10),
        $lte: endDate.toISOString().slice(0, 10),
      },
    });

    res.json(corrections);
  } catch (err) {
    logger.error('Ошибка при получении коррекций:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера при получении коррекций.', details: err.message });
  }
});

export default router;
