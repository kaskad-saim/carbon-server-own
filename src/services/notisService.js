// services/notisService.js
import { Notis1Model, Notis2Model } from '../models/notisModel.js';
import logger from '../logger.js';
import { serialDevicesConfig } from './devicesConfig.js';
import { getDataSequentially } from '../utils/serialPortManager.js';

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

async function processDeviceDataSequentially(client, deviceName, Model, indices, simulatedValue, delayBetweenIndices = 1000) {
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
      const value = simulatedValue !== null
        ? simulatedValue // Симулированные данные
        : await getDataSequentially(port, deviceAddress, index); // Последовательный запрос данных

      results[indexMapping[index] || `Параметр_${index}`] = value;

      if (delayBetweenIndices > 0) {
        await delay(delayBetweenIndices);
      }
    }

    let formattedData = formatResults(deviceName, results);

    // *** Новая логика проверки стабильности значения дозы (г/мин) и (кг/ч) ***
    const doseGramKey = `Доза (г/мин) ${deviceName}`;
    const doseKgKey = `Доза (кг/ч) ${deviceName}`;
    let deviceStatus = 'working';

    if (formattedData[doseGramKey] !== undefined) {
      const currentDoseGram = formattedData[doseGramKey];
      const currentDoseKg = formattedData[doseKgKey] || null;

      // Получаем последние две записи со статусом 'working'
      const lastTwoRecords = await Model.find({ status: 'working' }).sort({ lastUpdated: -1 }).limit(2);

      if (lastTwoRecords.length === 2) {
        const lastDoseGrams = lastTwoRecords.map(r => r.data.get(doseGramKey));
        const lastDoseKgs = lastTwoRecords.map(r => r.data.get(doseKgKey));

        logger.debug(`Last Dose Grams: ${lastDoseGrams}`);
        logger.debug(`Last Dose Kgs: ${lastDoseKgs}`);
        logger.debug(`Current Dose Gram: ${currentDoseGram}, Current Dose Kg: ${currentDoseKg}`);

        const isStable = lastDoseGrams.every(dose => dose === currentDoseGram) &&
                          lastDoseKgs.every(dose => dose === currentDoseKg);

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
