import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';
import logger from '../logger.js';
import { calcCrc, createGetDataRequest } from './crcUtils.js';
import { serialDevicesConfig } from '../services/devicesConfig.js';

const portsMap = {}; // { portName: { comPort, parser } }
const errorLogCache = {}; // Хранит устройства и типы ошибок для минимизации повторного логирования

export function initSerialPorts() {
  // Собираем уникальные конфигурации порт+скорость
  const uniquePortConfigs = {};
  for (const dev of serialDevicesConfig) {
    const key = `${dev.port}-${dev.baudRate}`;
    if (!uniquePortConfigs[key]) {
      uniquePortConfigs[key] = {
        portName: dev.port,
        baudRate: dev.baudRate
      };
    }
  }

  // Открываем каждый нужный порт один раз
  for (const key in uniquePortConfigs) {
    const { portName, baudRate } = uniquePortConfigs[key];

    // Инициализируем порт
    const comPort = new SerialPort({
      path: portName,
      baudRate: baudRate,
      autoOpen: true
    });

    // Логи при открытии порта
    comPort.on('open', () => {
      logger.info(`Подключение к ${portName} успешно установлено.`);
    });

    comPort.on('error', (err) => {
      logger.error(`Ошибка при работе с ${portName}: ${err.message}`);
    });

    const parser = comPort.pipe(new ReadlineParser({ delimiter: '\r\n' }));
    portsMap[portName] = { comPort, parser };
  }
}

export function getData(portName, address, index, retryCount = 3) {
  return new Promise((resolve, reject) => {
    const portObj = portsMap[portName];
    if (!portObj || !portObj.comPort) {
      return reject(new Error(`${portName} недоступен. Невозможно получить данные.`));
    }

    const { comPort } = portObj;
    const request = createGetDataRequest(index, address);
    const responseBuffer = [];

    const handleData = (data) => {
      responseBuffer.push(...Buffer.from(data));
      if (responseBuffer.length >= 12) {
        comPort.off('data', handleData);

        const crcReceived = responseBuffer.pop();
        const crcCalculated = calcCrc(responseBuffer);

        if (crcReceived !== crcCalculated) {
          // Проверка на повторную ошибку
          if (!errorLogCache[portName]) {
            errorLogCache[portName] = {};
          }

          const currentTime = Date.now();
          const lastErrorTime = errorLogCache[portName][index];

          // Если ошибка произошла недавно, не логировать её снова
          if (!lastErrorTime || (currentTime - lastErrorTime) > 60000) {
            errorLogCache[portName][index] = currentTime;
            logger.error(`[${portName}] Ошибка получения данных с индекса ${index}: CRC mismatch`);
          }

          // Если попытки еще есть, повторяем запрос
          if (retryCount > 0) {
            logger.info(`[${portName}] Попытка ${4 - retryCount} повторить запрос данных...`);
            setTimeout(() => {
              getData(portName, address, index, retryCount - 1) // Рекурсивный вызов с уменьшением количества попыток
                .then(resolve)
                .catch(reject);
            }, 2000); // Интервал между попытками 2 секунды
          } else {
            reject(new Error('CRC mismatch after 3 retries'));
          }
        } else {
          const buffer = Buffer.from(responseBuffer.slice(6, 10));
          const value = buffer.readUInt32LE();
          resolve(value);
        }
      }
    };

    comPort.on('data', handleData);

    comPort.write(Buffer.from(request), (err) => {
      if (err) {
        logger.error(`Ошибка записи в ${portName}: ${err.message}`);
        reject(err);
      }
    });
  });
}
