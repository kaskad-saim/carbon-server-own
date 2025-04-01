// services/pechVr2ModbusService.js
import { PechVr2Model } from '../models/pechVrModel.js';

let previousTemperatures = {};
let temperatureChangeCounters = {};

// Функция проверки допустимого изменения температуры
const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];
  const threshold = 100;
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
      console.warn(`[VR2] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`);
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0;
      return true;
    } else {
      console.warn(`[VR2] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`);
      return false;
    }
  } else {
    temperatureChangeCounters[label] = 0;
    previousTemperatures[label] = newTemp;
    return true;
  }
};

export const readDataVr2 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    // НЕ вызываем modbusClient.connect();

    // Адреса температур для VR2
    const temperatureAddresses = {
      '1-СК': 0x0002,
      '2-СК': 0x0004,
      '3-СК': 0x0006,
      'В топке': 0x0000,
      'Вверху камеры загрузки': 0x0012,
      'Внизу камеры загрузки': 0x0008,
      'На входе печи дожига': 0x000a,
      'На выходе печи дожига': 0x000c,
      'Камеры выгрузки': 0x0030,
      'Дымовых газов котла': 0x000e,
      'Газов до скруббера': 0x0010,
      // 'Газов после скруббера': 0x004c,
      'Воды в ванне скруббера': 0x0014,
      'Гранул после холод-ка': 0x0016,
    };

    const temperaturesVr2 = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await modbusClient.readFloat(deviceID, address, deviceLabel));
        if (isTemperatureValid(label, value)) {
          temperaturesVr2[label] = value;
        } else {
          console.warn(`[${deviceLabel}] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    // Чтение уровней
    const levelsVr2 = {
      'В ванне скруббера': {
        value: Math.round((await modbusClient.readFloat(deviceID, 0x002a, deviceLabel)) * 10),
        percent: Math.round(await modbusClient.readFloat(deviceID, 0x002a, deviceLabel)),
      },
      'В емкости ХВО': {
        value: Math.round((await modbusClient.readFloat(deviceID, 0x003e, deviceLabel)) * 60),
        percent: Math.round(await modbusClient.readFloat(deviceID, 0x003e, deviceLabel)),
      },
      'В барабане котла': {
        value: Math.round((await modbusClient.readFloat(deviceID, 0x0018, deviceLabel)) * 4 - 200),
        percent: Math.round(await modbusClient.readFloat(deviceID, 0x0018, deviceLabel)),
      },
    };

    // Чтение давлений
    const pressuresVr2 = {
      'Давление газов после скруббера': ((await modbusClient.readFloat(deviceID, 0x0028, deviceLabel)) * 0.25).toFixed(1),
      'Пара в барабане котла': ((await modbusClient.readFloat(deviceID, 0x0026, deviceLabel)) * 0.16).toFixed(1),
    };

    // Чтение разрежений
    const vacuumsVr2 = {
      'В топке печи': ((await modbusClient.readFloat(deviceID, 0x0020, deviceLabel)) * 0.25 - 12.5).toFixed(1),
      'В котле утилизаторе': ((await modbusClient.readFloat(deviceID, 0x0024, deviceLabel)) * -0.25).toFixed(1),
      'Низ загрузочной камеры': ((await modbusClient.readFloat(deviceID, 0x0022, deviceLabel)) * -0.25).toFixed(1),
    };

    // Чтение импульсных сигналов
    const imVr2 = {
      'ИМ1 скруббер': (await modbusClient.readFloat(deviceID, 0x0044, deviceLabel)) > 1,
      'ИМ2 ХВО': (await modbusClient.readFloat(deviceID, 0x0046, deviceLabel)) > 1,
      'ИМ3 аварийный сброс': (await modbusClient.readFloat(deviceID, 0x0048, deviceLabel)) > 1,
      'ИМ4 пар в отделение активации': (await modbusClient.readFloat(deviceID, 0x004a, deviceLabel)) > 1,
      'ИМ5 котел-утилизатор': Math.round(await modbusClient.readFloat(deviceID, 0x001c, deviceLabel)),
    };

    // Чтение данных горелки
    const gorelkaVr2 = {
      'Мощность горелки №2': Math.max(0, Math.round(await modbusClient.readFloat(deviceID, 0x001a, deviceLabel))),
      'Задание температуры на горелку №2': Math.round(await modbusClient.readFloat(deviceID, 0x002e, deviceLabel)),
    };

    // Формирование объекта данных
    const formattedDataVr2 = {
      temperatures: temperaturesVr2,
      levels: levelsVr2,
      pressures: pressuresVr2,
      vacuums: vacuumsVr2,
      im: imVr2,
      gorelka: gorelkaVr2,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new PechVr2Model(formattedDataVr2).save();
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
