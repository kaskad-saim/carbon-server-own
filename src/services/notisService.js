// services/notisService.js
import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import logger from '../logger.js';
import { serialDevicesConfig } from './devicesConfig.js';
import { getDataSequentially } from '../utils/serialPortManager.js';
import { isValueWithinRange, isValueStable } from '../utils/validation.js'; // Импортируем функцию проверки

// Определите допустимые диапазоны для параметров
const parameterRanges = {
  'Доза (г/мин)': { min: 0, max: 25000 }, // Пример диапазона
  'Доза (кг/ч)': { min: 0, max: 1500 }, // Пример диапазона
  // Добавьте другие параметры и их диапазоны по необходимости
};

export const readDataNotis1 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [8];
  await processDeviceDataSequentially(client, 'НОТИС1', Notis1Model, indices, simulatedValue);
};

export const readDataNotis2 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [8];
  await processDeviceDataSequentially(client, 'НОТИС2', Notis2Model, indices, simulatedValue);
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processDeviceDataSequentially(
  client,
  deviceName,
  Model,
  indices,
  simulatedValue,
  delayBetweenIndices = 1000
) {
  const device = serialDevicesConfig.find((d) => d.name === deviceName);
  if (!device) {
    logger.error(`[${deviceName}] Не найдено устройство в конфиге`);
    return;
  }

  const indexMapping = {
    8: 'Доза (г/мин)',
  };

  const { address: deviceAddress, port } = device;

  try {
    const results = {};
    for (const index of indices) {
      const rawValue =
        simulatedValue !== null
          ? simulatedValue // Симулированные данные
          : await getDataSequentially(port, deviceAddress, index); // Последовательный запрос данных

      const parameterName = indexMapping[index] || `Параметр_${index}`;

      // Преобразуем значение в число, если это необходимо
      const value = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;

      // Проверяем, находится ли значение в допустимом диапазоне
      const range = parameterRanges[parameterName];
      if (range && !isValueWithinRange(value, range.min, range.max)) {
        logger.warn(
          `[${deviceName}] Выброс: ${parameterName} = ${value} выходит за допустимые пределы (${range.min}-${range.max}). Значение будет проигнорировано.`
        );
        continue; // Пропускаем запись этого параметра
      }

      if (!isValueStable(parameterName, value)) {
        logger.warn(
          `[${deviceName}] Значительное изменение значения для ${parameterName}. Значение будет проигнорировано.`
        );
        continue; // Пропускаем запись этого параметра
      }

      results[parameterName] = value;

      if (delayBetweenIndices > 0) {
        await delay(delayBetweenIndices);
      }
    }

    if (Object.keys(results).length === 0) {
      logger.warn(`[${deviceName}] Нет допустимых данных для записи.`);
      return;
    }

    let formattedData = formatResults(deviceName, results);

    // *** Новая логика проверки стабильности значения дозы (г/мин) и (кг/ч) ***
    const doseGramKey = `Доза (г/мин) ${deviceName}`;
    const doseKgKey = `Доза (кг/ч) ${deviceName}`;
    let deviceStatus = 'working';

    if (formattedData[doseGramKey] !== undefined) {
      const currentDoseGram = formattedData[doseGramKey];
      const currentDoseKg = formattedData[doseKgKey] || null;

      // Получаем последние четыре записи со статусом 'working'
      const lastFourRecords = await Model.find({ status: 'working' }).sort({ lastUpdated: -1 }).limit(4);

      if (lastFourRecords.length === 4) {
        const lastDoseGrams = lastFourRecords.map((r) => r.data.get(doseGramKey));

        logger.debug(`Last Dose Grams: ${lastDoseGrams}`);
        logger.debug(`Current Dose Gram: ${currentDoseGram}`);

        // Проверяем, одинаковы ли последние четыре значения doseGram с текущим
        const isStable = lastDoseGrams.every((dose) => dose === currentDoseGram);

        logger.debug(`Is Stable: ${isStable}`);

        if (isStable) {
          deviceStatus = 'idle';
        }
      }

      // Если статус 'idle', установить дозы в 0
      if (deviceStatus === 'idle') {
        formattedData[doseGramKey] = 0;
        formattedData[doseKgKey] = 0;
      }

      await new Model({
        data: formattedData, // Только числа, с дозами 0, если idle
        status: deviceStatus, // 'idle' или 'working'
        lastUpdated: new Date(),
      }).save();
    }
  } catch (error) {
    logger.error(`[${deviceName}] Ошибка обработки данных: ${error.message}`);
  }
}

function formatResults(deviceName, results) {
  const formattedResults = {};

  for (const [key, value] of Object.entries(results)) {
    const formattedKey = `${key} ${deviceName}`; // Добавляем имя устройства
    formattedResults[formattedKey] = value;

    // Специальный расчет для индекса 8 (граммы/мин -> кг/ч)
    if (key.startsWith('Доза (г/мин)')) {
      const doseKgPerHourKey = `Доза (кг/ч) ${deviceName}`;
      formattedResults[doseKgPerHourKey] = Math.round((value / 1000) * 60 * 10) / 10;
    }
  }

  return formattedResults;
}
