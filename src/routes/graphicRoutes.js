import express from 'express';
import { PechVr1Model, PechVr2Model } from '../models/pechVrModel.js';
import { PechMpa2Model, PechMpa3Model } from '../models/pechMpaModel.js';
import logger from '../logger.js';
import { Sushilka1Model, Sushilka2Model } from '../models/sushilkaModel.js';

const router = express.Router();

// Маршрут для получения данных VR1
router.get('/vr1/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechVr1Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных VR1:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения данных VR2
router.get('/vr2/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechVr2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных VR2:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения данных MPA2
router.get('/mpa2/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechMpa2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных MPA2:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения данных MPA3
router.get('/mpa3/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechMpa3Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных MPA3:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/sushilka1/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await Sushilka1Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных MPA3:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/sushilka2/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await Sushilka2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных MPA3:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
