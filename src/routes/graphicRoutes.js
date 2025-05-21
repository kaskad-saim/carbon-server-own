import express from 'express';
import { PechVr1Model, PechVr2Model } from '../models/pechVrModel.js';
import { PechMpa2Model, PechMpa3Model } from '../models/pechMpaModel.js';
import logger from '../logger.js';
import { Sushilka1Model, Sushilka2Model } from '../models/sushilkaModel.js';
import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import {
  imDD923Model,
  imDD924Model,
  imDD569Model,
  imDD576Model,
  imDD973Model,
  imDE093Model,
  imDD972Model,
} from '../models/uzliUchetaModel.js';
import { Mill10bModel, Mill1Model, Mill2Model } from '../models/millModel.js';
import { Reactor296Model } from '../models/reactor296Model.js';
import { Press3Model } from '../models/pressK296Model.js';

const router = express.Router();

// Объект для связи идентификаторов устройств с их моделями
const deviceModels = {
  vr1: PechVr1Model,
  vr2: PechVr2Model,
  mpa2: PechMpa2Model,
  mpa3: PechMpa3Model,
  sushilka1: Sushilka1Model,
  sushilka2: Sushilka2Model,
  notis1: Notis1Model,
  notis2: Notis2Model,
  dd923: imDD923Model,
  dd924: imDD924Model,
  dd569: imDD569Model,
  dd576: imDD576Model,
  dd973: imDD973Model,
  de093: imDE093Model,
  dd972: imDD972Model,
  mill1: Mill1Model,
  mill2: Mill2Model,
  mill10b: Mill10bModel,
  reactor296: Reactor296Model,
  press3: Press3Model,
};

// Универсальный маршрут для всех устройств
router.get('/:deviceId/data', async (req, res) => {
  try {
    const { deviceId } = req.params; // Идентификатор устройства (например, vr1, mpa2, dd923)
    const { start, end } = req.query;

    // Получаем модель устройства по идентификатору
    const deviceModel = deviceModels[deviceId.toLowerCase()];

    if (!deviceModel) {
      return res.status(404).json({ error: 'Устройство не найдено' });
    }

    // Формируем запрос для фильтрации по времени
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};

    // Получаем данные из модели
    const data = await deviceModel.find(query).sort({ lastUpdated: 1 });

    // Возвращаем данные
    res.json(data);
  } catch (error) {
    logger.error(`Ошибка при получении данных для устройства ${req.params.deviceId}:`, error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

export default router;
