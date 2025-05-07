// services/sushilka2ModbusService.js
import { Sushilka2Model } from '../models/sushilkaModel.js';

let previousTemperatures = {};
let temperatureChangeCounters = {};

// Функция проверки допустимого изменения температуры
const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];
  const threshold = 150;
  const maxConsecutiveChanges = 3;

  if (previousTemp === undefined) {
    previousTemperatures[label] = newTemp;
    temperatureChangeCounters[label] = 0;
    return true;
  }

  const tempDifference = Math.abs(newTemp - previousTemp);

  if (tempDifference > threshold) {
    temperatureChangeCounters[label] = (temperatureChangeCounters[label] || 0) + 1;

    if (temperatureChangeCounters[label] >= maxConsecutiveChanges) {
      console.warn(`[Sushilka2] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`);
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0;
      return true;
    } else {
      console.warn(`[Sushilka2] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`);
      return false;
    }
  } else {
    temperatureChangeCounters[label] = 0;
    previousTemperatures[label] = newTemp;
    return true;
  }
};

export const readDataSushilka2 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    // НЕ вызываем modbusClient.connect();

    // Чтение температур
    const temperatureAddresses = {
      'Температура в топке': 0x0000,
      'Температура в камере смешения': 0x0002,
      'Температура уходящих газов': 0x0006,
    };

    const temperatures = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await modbusClient.readFloat(deviceID, address, deviceLabel));
        if (isTemperatureValid(label, value)) {
          temperatures[label] = value;
        } else {
          console.warn(`[${deviceLabel}] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    // Чтение разрежений
    const vacuums = {
      'Разрежение в топке': ((await modbusClient.readFloat(deviceID, 0x000A, deviceLabel)) * 0.25 - 12.5).toFixed(1),
      'Разрежение в камере выгрузки': -((await modbusClient.readFloat(deviceID, 0x000C, deviceLabel)) * 0.25).toFixed(1),
      // 'Разрежение воздуха на разбавление': ((await modbusClient.readFloat(deviceID, 0x000E, deviceLabel)) * 5).toFixed(1),
    };

    // Чтение данных горелки
    const gorelka = {
      'Мощность горелки №2': Math.max(0, Math.round(await modbusClient.readFloat(deviceID, 0x0010, deviceLabel))),
      'Сигнал от регулятора №2': Math.round(await modbusClient.readFloat(deviceID, 0x0012, deviceLabel)),
      'Задание температуры №2': Math.round(await modbusClient.readFloat(deviceID, 0x0014, deviceLabel)),
    };

    // Чтение импульсных сигналов
    const im = {
      'Индикация паротушения': (await modbusClient.readFloat(deviceID, 0x001E, deviceLabel)) > 1,
      'Индикация сбрасыватель': (await modbusClient.readFloat(deviceID, 0x0020, deviceLabel)) > 1,
    };

    const formattedData = {
      temperatures,
      vacuums,
      gorelka,
      im,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new Sushilka2Model(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
