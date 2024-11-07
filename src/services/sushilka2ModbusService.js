import ModbusRTU from 'modbus-serial';
import { Mutex } from 'async-mutex';
import { Sushilka2Model } from '../models/sushilkaModel.js';

const port = 'COM3';
const baudRate = 57600;
const timeout = 12000;
const retryInterval = 15000;
const maxRetries = 20;
const deviceID = 2;
let isConnected = false;

const modbusClient = new ModbusRTU();
const mutex = new Mutex();

// Подключение к Modbus для Сушилки 2
export const connectModbusSushilka2 = async () => {
  if (isConnected) return;

  try {
    modbusClient.setTimeout(timeout);
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port} для Sushilka 2`);
    isConnected = true;
  } catch (err) {
    console.error('Ошибка при подключении к Modbus для Sushilka 2:', err);
    isConnected = false;
    setTimeout(connectModbusSushilka2, retryInterval);
  }
};

// Функция чтения значения с регистра и преобразования в число с плавающей точкой
const readFloat = async (address) => {
  return await mutex.runExclusive(async () => {
    modbusClient.setID(deviceID);
    if (!isConnected) {
      console.log('Modbus не подключен. Попытка переподключения...');
      await connectModbusSushilka2();
    }

    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const data = await modbusClient.readHoldingRegisters(address, 2);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(data.data[0], 2);
        buffer.writeUInt16BE(data.data[1], 0);
        return buffer.readFloatBE(0);
      } catch (err) {
        attempts++;
        console.error(`Ошибка при чтении данных с адреса ${address}, попытка ${attempts}/${maxRetries}:`, err);

        if (attempts >= maxRetries) {
          console.warn('Превышено максимальное количество попыток чтения. Попытка переподключения...');
          isConnected = false;
          await connectModbusSushilka2();
          attempts = 0;
        }

        // Ждём перед следующей попыткой
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  });
};

// Логика проверки допустимого изменения температуры для Сушилки 2
let previousTemperatures = {}; // Хранит предыдущие значения температур для Сушилки 2
let temperatureChangeCounters = {}; // Хранит количество последовательных значительных изменений

const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];
  const threshold = 150; // Допустимое разовое изменение температуры
  const maxConsecutiveChanges = 3; // Количество последовательных изменений для принятия нового значения

  if (previousTemp === undefined) {
    // Первое значение, принимаем его
    previousTemperatures[label] = newTemp;
    temperatureChangeCounters[label] = 0;
    return true;
  }

  const tempDifference = Math.abs(newTemp - previousTemp);

  if (tempDifference > threshold) {
    // Значительное изменение температуры
    if (!temperatureChangeCounters[label]) {
      temperatureChangeCounters[label] = 1;
    } else {
      temperatureChangeCounters[label]++;
    }

    if (temperatureChangeCounters[label] >= maxConsecutiveChanges) {
      console.warn(`[Sushilka2] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`);
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
      return true;
    } else {
      console.warn(
        `[Sushilka2] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`
      );
      return false;
    }
  } else {
    // Изменение температуры в пределах допустимого
    temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
    previousTemperatures[label] = newTemp;
    return true;
  }
};

// Основная функция чтения данных для Сушилки 2
export const readDataSushilka2 = async () => {
  try {
    const temperatures = {
      'Температура в топке': Math.round(await readFloat(0x0000, 'Sushilka2', deviceID)),
      'Температура в камере смешения': Math.round(await readFloat(0x0002, 'Sushilka2', deviceID)),
      'Температура уходящих газов': Math.round(await readFloat(0x0006, 'Sushilka2', deviceID)),
    };

    const validatedTemperatures = {};
    for (const [label, value] of Object.entries(temperatures)) {
      if (isTemperatureValid(label, value)) {
        validatedTemperatures[label] = value;
      } else {
        console.warn(`[Sushilka2] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
      }
    }

    // Чтение разрежений
    const vacuums = {
      'Разрежение в топке': Math.round(((await readFloat(0x000a, 'Sushilka2', deviceID)) * 0.25 - 12.5) * 10) / 10,
      'Разрежение в камере выгрузки': Math.round((await readFloat(0x000c, 'Sushilka2', deviceID)) * 0.25 * 10) / 10,
      'Разрежение воздуха на разбавление': Math.round((await readFloat(0x000e, 'Sushilka2', deviceID)) * 5 * 10) / 10,
    };

    // Чтение данных горелки
    const gorelka = {
      'Мощность горелки №2': Math.max(0, Math.round(await readFloat(0x0010, 'Sushilka2', deviceID))),
      'Сигнал от регулятора': Math.round(await readFloat(0x0012, 'Sushilka2', deviceID)),
      'Задание температуры': Math.round(await readFloat(0x0014, 'Sushilka2', deviceID)),
    };

    // Чтение импульсных сигналов
    const im = {
      'Индикация паротушения': (await readFloat(0x001e, 'Sushilka2', deviceID)) > 1,
      'Индикация сбрасыватель': (await readFloat(0x0020, 'Sushilka2', deviceID)) > 1,
    };

    const formattedData = {
      temperatures: validatedTemperatures,
      vacuums,
      gorelka,
      im,
      lastUpdated: new Date(),
    };

    // console.log('Форматированные данные для Sushilka 2:', formattedData);
    // Сохранение данных в базу данных
    await new Sushilka2Model(formattedData).save();
  } catch (error) {
    console.error('Ошибка при чтении данных Sushilka 2:', error);
  }
};
