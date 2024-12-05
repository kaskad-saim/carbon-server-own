import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import { getData } from '../utils/serialPortUtils.js'; // Обновленный импорт
import logger from '../logger.js';

// Функция для чтения и записи данных устройства Notis1
export const readDataNotis1 = async () => {
  try {
    const address = 1; // Адрес для Notis1
    const deviceName = 'ПК1';

    const data = await fetchNotisData(deviceName, address);
    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new Notis1Model(formattedData).save();
    // logger.info(`[Notis1] Данные успешно сохранены: ${JSON.stringify(formattedData)}`);
  } catch (err) {
    logger.error(`[Notis1] Ошибка при чтении данных: ${err.message}`);
  }
};

// Функция для чтения и записи данных устройства Notis2
export const readDataNotis2 = async () => {
  try {
    const address = 2; // Адрес для Notis2
    const deviceName = 'ПК2';

    const data = await fetchNotisData(deviceName, address);
    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new Notis2Model(formattedData).save();
    // logger.info(`[Notis2] Данные успешно сохранены: ${JSON.stringify(formattedData)}`);
  } catch (err) {
    logger.error(`[Notis2] Ошибка при чтении данных: ${err.message}`);
  }
};

// Универсальная функция получения данных
const fetchNotisData = async (deviceName, address) => {
  const indexMapping = {
    1: 'Доза (г)',
    5: 'Текущее количество доз (шт)',
    8: 'Доза (г/мин)',
  };

  const indices = [1, 5, 8];
  const results = {};

  for (const index of indices) {
    try {
      const value = await getData(index, address); // Вызов утилиты для получения данных
      const key = `${indexMapping[index]}`;
      results[key] = value;

      // Если индекс 8 (Доза_г/мин), добавляем расчет для Доза_кг/ч
      if (index === 8) {
        const doseKgPerHourKey = `Доза (кг/ч)`;
        const doseKgPerHourValue = Math.round((value / 1000 * 60) * 10) / 10; // Округляем до 1 знака
        results[doseKgPerHourKey] = doseKgPerHourValue;
      }
    } catch (error) {
      logger.error(`[${deviceName}] Ошибка получения данных с индекса ${index}: ${error.message}`);
    }
  }

  return results;
};
