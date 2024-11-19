// routes/mill1Routes.js

import express from 'express';
import { Mill1Model } from '../models/millModel.js';

const router = express.Router();

router.get('/mill1/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = {};
    if (start && end) {
      query.lastUpdated = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
    const data = await Mill1Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных Мельница 1:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
