// services/notisService.js
import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import logger from '../logger.js';
import { serialDevicesConfig } from './devicesConfig.js';
import { getDataSequentially } from '../utils/serialPortManager.js';
import { isValueWithinRange, isValueStable } from '../utils/validation.js';

// Определите допустимые диапазоны для параметров
const parameterRanges = {
  'Доза (г/мин)': { min: 0, max: 25000 },
  'Доза (кг/ч)': { min: 0, max: 1500 },
  // Добавьте другие параметры при необходимости
};

export const readDataNotis1 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [8];
  await processDeviceDataSequentially(client, deviceName, 'НОТИС1', Notis1Model, indices, simulatedValue);
};

export const readDataNotis2 = async (client, deviceName, address, simulatedValue = null) => {
  const indices = [8];
  await processDeviceDataSequentially(client, deviceName, 'НОТИС2', Notis2Model, indices, simulatedValue);
};

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function processDeviceDataSequentially(
  client,
  deviceName,
  deviceLabel,
  Model,
  indices,
  simulatedValue,
  delayBetweenIndices = 1000
) {
  const device = serialDevicesConfig.find((d) => d.name === deviceLabel);
  if (!device) {
    logger.error(`[${deviceLabel}] Не найдено устройство в конфиге`);
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
      const parameterLabel = `${parameterName} ${deviceLabel}`; // Уникальный label для проверки стабильности

      // Преобразуем значение в число
      const value = typeof rawValue === 'string' ? parseFloat(rawValue) : rawValue;

      // Проверяем допустимый диапазон
      const range = parameterRanges[parameterName];
      if (range && !isValueWithinRange(value, range.min, range.max)) {
        logger.warn(
          `[${deviceLabel}] Выброс: ${parameterName} = ${value} выходит за допустимые пределы (${range.min}-${range.max}). Значение будет проигнорировано.`
        );
        continue; // Пропускаем запись этого параметра
      }

      // Проверяем стабильность значения
      if (!isValueStable(parameterLabel, value)) {
        logger.warn(
          `[${deviceLabel}] Значительное изменение значения для ${parameterName}. Значение будет проигнорировано.`
        );
        continue; // Пропускаем запись этого параметра
      }

      results[parameterName] = value;

      if (delayBetweenIndices > 0) {
        await delay(delayBetweenIndices);
      }
    }

    if (Object.keys(results).length === 0) {
      logger.warn(`[${deviceLabel}] Нет допустимых данных для записи.`);
      return;
    }

    let formattedData = formatResults(deviceLabel, results);

    // Проверка стабильности 4 последних значений для определения статуса устройства
    const doseGramKey = `Доза (г/мин) ${deviceLabel}`;
    const doseKgKey = `Доза (кг/ч) ${deviceLabel}`;
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
        data: formattedData,
        status: deviceStatus,
        lastUpdated: new Date(),
      }).save();
    }
  } catch (error) {
    logger.error(`[${deviceLabel}] Ошибка обработки данных: ${error.message}`);
  }
}

function formatResults(deviceLabel, results) {
  const formattedResults = {};

  for (const [key, value] of Object.entries(results)) {
    const formattedKey = `${key} ${deviceLabel}`;
    formattedResults[formattedKey] = value;

    // Для "Доза (г/мин)" считаем "Доза (кг/ч)"
    if (key.startsWith('Доза (г/мин)')) {
      const doseKgPerHourKey = `Доза (кг/ч) ${deviceLabel}`;
      formattedResults[doseKgPerHourKey] = Math.round((value / 1000) * 60 * 10) / 10;
    }
  }

  return formattedResults;
}
