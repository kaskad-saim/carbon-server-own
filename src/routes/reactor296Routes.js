// routes/reactorRoutes.js

import express from 'express';
import { Reactor296Model } from '../models/reactor296Model.js';


const router = express.Router();

router.get('/reactorK296/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = {};
    if (start && end) {
      query.lastUpdated = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }
    const data = await Reactor296Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных Реактора К296:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
