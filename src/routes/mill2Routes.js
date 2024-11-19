// routes/mill2Routes.js

import express from 'express';
import { Mill2Model } from '../models/millModel.js';

const router = express.Router();

router.get('/mill2/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = {};
    if (start && end) {
      query.lastUpdated = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
    const data = await Mill2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных Мельница 2:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
