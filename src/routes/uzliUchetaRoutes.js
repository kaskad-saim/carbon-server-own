import express from 'express';
import logger from '../logger.js';
import {
  imDD923Model,
  imDD924Model,
  imDD569Model,
  imDD576Model,
  imDD973Model,
  imDE093Model,
  imDD972Model,
} from '../models/uzliUchetaModel.js';

const router = express.Router();

// Маппинг моделей устройств
const deviceModels = {
  dd923: { model: imDD923Model, name: 'DD923' },
  dd924: { model: imDD924Model, name: 'DD924' },
  dd569: { model: imDD569Model, name: 'DD569' },
  dd576: { model: imDD576Model, name: 'DD576' },
  dd973: { model: imDD973Model, name: 'DD973' },
  de093: { model: imDE093Model, name: 'DE093' },
  dd972: { model: imDD972Model, name: 'DD972' },
};

// Функция для получения данных одного устройства
const getDeviceData = async (model, deviceName) => {
  try {
    const data = await model.find().sort({ lastUpdated: -1 }).limit(1);
    if (!data[0]) {
      return { device: deviceName, data: null, lastUpdated: null, outdated: true };
    }

    const lastUpdated = new Date(data[0].lastUpdated);
    const currentTime = new Date();

    // Проверяем актуальность данных
    const isDataOutdated = currentTime - lastUpdated > 60000; // Данные старше 1 минуты

    return {
      device: deviceName,
      data: isDataOutdated ? mapValuesToDash(data[0].data) : data[0].data,
      lastUpdated: lastUpdated.toLocaleString('ru-RU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      outdated: isDataOutdated,
    };
  } catch (err) {
    logger.error(`Ошибка при получении данных ${deviceName}:`, err);
    return { device: deviceName, data: null, lastUpdated: null, error: true };
  }
};

// Функция для замены всех значений в объекте на прочерк
const mapValuesToDash = (obj) => {
  return Object.fromEntries(Object.keys(obj).map((key) => [key, '-']));
};

// Один маршрут для всех устройств
router.get('/uzliUchetaCarbon', async (req, res) => {
  const results = {};

  await Promise.all(
    Object.entries(deviceModels).map(async ([key, { model, name }]) => {
      const deviceData = await getDeviceData(model, name);
      results[key] = deviceData;
    })
  );

  res.json(results);
});

export default router;
