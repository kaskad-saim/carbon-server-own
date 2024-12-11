import { SerialPort } from 'serialport';
import { ReadlineParser } from 'serialport';
import logger from '../logger.js';
import { calcCrc, createGetDataRequest } from './crcUtils.js';
import { serialDevicesConfig } from '../services/devicesConfig.js';

const portsMap = {}; // { portName: { comPort, parser } }
// const errorLogCache = {}; // Кэш для минимизации повторного логирования

// Инициализация всех необходимых COM-портов
export function initSerialPorts() {
  const uniquePortConfigs = {};

  // Собираем уникальные комбинации портов и скоростей
  for (const dev of serialDevicesConfig) {
    const key = `${dev.port}-${dev.baudRate}`;
    if (!uniquePortConfigs[key]) {
      uniquePortConfigs[key] = {
        portName: dev.port,
        baudRate: dev.baudRate,
      };
    }
  }

  // Открываем каждый порт
  for (const key in uniquePortConfigs) {
    const { portName, baudRate } = uniquePortConfigs[key];

    // Инициализация порта
    const comPort = new SerialPort({
      path: portName,
      baudRate: baudRate,
      autoOpen: true,
    });

    // Обработчики событий
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

// Проверка CRC
function validateResponseCRC(responseBuffer) {
  const crcReceived = responseBuffer.pop(); // Последний байт — CRC
  const crcCalculated = calcCrc(responseBuffer); // Рассчитываем CRC
  return crcReceived === crcCalculated;
}

// Извлечение данных
function extractData(responseBuffer) {
  const buffer = Buffer.from(responseBuffer.slice(6, 10)); // Байты 6–9
  return buffer.readUInt32LE(); // Читаем как 32-битное число
}

// Логирование ошибок с предотвращением дублирования
function logErrorOnce(portName, index, message, cache, interval = 60000) {
  if (!cache[portName]) {
    cache[portName] = {};
  }

  const currentTime = Date.now();
  const lastLogTime = cache[portName][index];

  if (!lastLogTime || (currentTime - lastLogTime) > interval) {
    cache[portName][index] = currentTime;
    logger.error(`[${portName}] ${message}`);
  }
}

// Основная функция получения данных
export function getData(portName, address, index, retryCount = 10) {
  return new Promise((resolve, reject) => {
    const portObj = portsMap[portName];
    if (!portObj || !portObj.comPort) {
      return reject(new Error(`${portName} недоступен. Невозможно получить данные.`));
    }

    const { comPort } = portObj;
    const request = createGetDataRequest(index, address);
    const responseBuffer = [];

    // Обработчик данных
    const handleData = (data) => {
      responseBuffer.push(...Buffer.from(data));

      if (responseBuffer.length >= 12) {
        comPort.off('data', handleData);

        if (!validateResponseCRC(responseBuffer)) {
          // logErrorOnce(portName, index, `Ошибка CRC с индекса ${index}: CRC mismatch`, errorLogCache);

          if (retryCount > 0) {
            logger.info(`[${portName}] Попытка ${11 - retryCount} повторить запрос данных...`);
            setTimeout(() => {
              getData(portName, address, index, retryCount - 1)
                .then(resolve)
                .catch(reject);
            }, 2000);
          } else {
            reject(new Error('CRC mismatch after 5 retries'));
          }
          return;
        }

        resolve(extractData(responseBuffer));
      }
    };

    // Подключаем обработчик данных
    comPort.on('data', handleData);

    // Проверяем состояние порта перед записью
    if (!comPort.isOpen) {
      return reject(new Error(`Порт ${portName} закрыт.`));
    }

    // Отправляем запрос
    comPort.write(Buffer.from(request), (err) => {
      if (err) {
        comPort.off('data', handleData); // Удаляем обработчик
        logger.error(`Ошибка записи в ${portName}: ${err.message}`);
        reject(err);
      }
    });
  });
}

// Функция с ретраями для получения данных
export async function retryGetData(portName, address, index, maxRetries = 10, delay = 5000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await getData(portName, address, index, 0); // Попытка получения данных
    } catch (err) {
      if (attempt < maxRetries) {
        logger.info(`[${portName}]  Попытка ${attempt} повторить запрос данных...`);
        await new Promise((resolve) => setTimeout(resolve, delay)); // Задержка между попытками
      } else {
        throw new Error(`Ошибка после ${maxRetries} попыток: ${err.message}`);
      }
    }
  }
}

// Очередь запросов
let requestQueue = Promise.resolve(); // Изначально пустая очередь

// Последовательное выполнение запросов через очередь
function enqueueRequest(promiseFunction) {
  requestQueue = requestQueue.then(promiseFunction).catch((err) => {
    logger.error(`Ошибка в очереди запросов: ${err.message}`);
  });
  return requestQueue;
}

// Основная функция получения данных с учетом адреса
export function getDataSequentially(portName, address, index, retryCount = 10) {
  return enqueueRequest(() =>
    getData(portName, address, index, retryCount)
      .then((data) => {
        // logger.info(`Успешно получены данные с адреса ${address}, индекс ${index}: ${data}`);
        return data;
      })
  );
}
