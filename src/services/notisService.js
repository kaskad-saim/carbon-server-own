// services/notisService.js
import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import { getData } from '../utils/serialPortManager.js';
import logger from '../logger.js';
import { serialDevicesConfig } from './devicesConfig.js';

// Функции для чтения данных из Notis устройств
export const readDataNotis1 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [1, 5, 8];
  await readNotisData(client, 'НОТИС1', Notis1Model, indices, simulatedValue);
};

export const readDataNotis2 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [1, 5, 8];
  await readNotisData(client, 'НОТИС2', Notis2Model, indices, simulatedValue);
};

async function readNotisData(client, deviceName, Model, indices, simulatedValue) {
  const device = serialDevicesConfig.find(d => d.name === deviceName);
  if (!device) {
    logger.error(`[${deviceName}] Не найдено устройство в конфиге`);
    return;
  }

  const { address: deviceAddress, port } = device;

  const indexMapping = {
    1: 'Доза (г)',
    5: 'Текущее количество доз (шт)',
    8: 'Доза (г/мин)',
  };

  const results = {};
  for (const index of indices) {
    try {
      let value;
      if (simulatedValue !== null) {
        // В случае симуляции используем переданное значение
        value = simulatedValue;
      } else {
        // В продакшене читаем реальные данные
        value = await getData(port, deviceAddress, index);
      }

      const keyBase = indexMapping[index] || `Параметр_${index}`;
      const key = `${keyBase} ${deviceName}`; // Добавляем название устройства
      results[key] = value;

      if (index === 8) {
        const doseKgPerHourKey = `Доза (кг/ч) ${deviceName}`; // Добавляем название устройства
        const doseKgPerHourValue = Math.round((value / 1000 * 60) * 10) / 10;
        results[doseKgPerHourKey] = doseKgPerHourValue;
      }
    } catch (error) {
      logger.error(`[${deviceName}] Ошибка получения данных с индекса ${index}: ${error.message}`);
    }
  }

  const formattedData = {
    data: results,
    lastUpdated: new Date(),
  };

  await new Model(formattedData).save();
}
