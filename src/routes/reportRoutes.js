// routes/reportRoutes.js
import express from 'express';
import { getDailyReportData } from '../services/reportService.js';

const router = express.Router();

router.get('/getReportData', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Дата не указана' });
  }

  try {
    const reportData = await getDailyReportData(date);
    res.json(reportData);
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
