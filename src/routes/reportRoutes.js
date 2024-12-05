// routes/reportRoutes.js
import express from 'express';
import { getDayReportData, getMonthReportData } from '../services/reportService.js';

const router = express.Router();

router.get('/getReportDataDay', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Дата не указана' });
  }

  try {
    const reportData = await getDayReportData(date);
    res.json(reportData);
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/getReportDataMonth', async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: 'Месяц не указан' });
  }

  try {
    const reportData = await getMonthReportData(month);
    res.json(reportData);
  } catch (err) {
    console.error('Ошибка при получении данных за месяц:', err.message, err.stack);
    res.status(500).json({ error: 'Ошибка сервера', details: err.message });
  }
});

// router.get('/debugData', async (req, res) => {
//   const date = '2024-12-03';
//   try {
//     const data = await getDayReportData(date);
//     res.json(data);
//   } catch (err) {
//     console.error('Ошибка при отладке данных:', err);
//     res.status(500).json({ error: 'Ошибка при отладке данных' });
//   }
// });


export default router;
