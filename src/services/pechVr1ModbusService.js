import { readFloat } from './modbusService.js';
import { PechVr1Model } from '../models/pechVrModel.js';

let previousTemperatures = {}; // Хранит предыдущие значения температур
let temperatureChangeCounters = {}; // Хранит количество последовательных значительных изменений

// Функция проверки допустимого изменения температуры
const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];
  const threshold = 100; // Допустимое разовое изменение температуры
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
      console.warn(`[VR1] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`);
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
      return true;
    } else {
      console.warn(`[VR1] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`);
      return false;
    }
  } else {
    // Изменение температуры в пределах допустимого
    temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
    previousTemperatures[label] = newTemp;
    return true;
  }
};

export const readDataVr1 = async () => {
  try {
    const deviceID = 3; // ID для VR1

    // Адреса температур для VR1
    const temperatureAddresses = {
      '1-СК': 0x0002,
      '2-СК': 0x0004,
      '3-СК': 0x0006,
      'В топке': 0x0000,
      'Вверху камеры загрузки': 0x0012,
      'Внизу камеры загрузки': 0x0008,
      'На входе печи дожига': 0x000a,
      'На выходе печи дожига': 0x000c,
      'Камеры выгрузки': 0x004e,
      'Дымовых газов котла': 0x000e,
      'Газов до скруббера': 0x0010,
      'Газов после скруббера': 0x004c,
      'Воды в ванне скруббера': 0x0014,
      'Гранул после холод-ка': 0x0016,
    };

    const temperaturesVr1 = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await readFloat(address, 'VR1', deviceID));
        if (isTemperatureValid(label, value)) {
          temperaturesVr1[label] = value;
        } else {
          console.warn(`[VR1] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[VR1] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    // Чтение уровней
    const levelsVr1 = {
      'В ванне скруббера': {
        value: Math.round((await readFloat(0x002a, 'VR1', deviceID)) * 10),
        percent: Math.round(await readFloat(0x002a, 'VR1', deviceID)),
      },
      'В емкости ХВО': {
        value: Math.round((await readFloat(0x003e, 'VR1', deviceID)) * 60),
        percent: Math.round(await readFloat(0x003e, 'VR1', deviceID)),
      },
      'В барабане котла': {
        value: Math.round((await readFloat(0x0018, 'VR1', deviceID)) * 4 - 200),
        percent: Math.round(await readFloat(0x0018, 'VR1', deviceID)),
      },
    };

    // Чтение давлений
    const pressuresVr1 = {
      'Давление газов после скруббера': ((await readFloat(0x0028, 'VR1', deviceID)) * 0.25).toFixed(1),
      'Пара в барабане котла': ((await readFloat(0x0026, 'VR1', deviceID)) * 0.16).toFixed(1),
    };

    // Чтение разрежений
    const vacuumsVr1 = {
      'В топке печи': ((await readFloat(0x0020, 'VR1', deviceID)) * 0.25 - 12.5).toFixed(1),
      'В котле утилизаторе': ((await readFloat(0x0024, 'VR1', deviceID)) * -0.25).toFixed(1),
      'Низ загрузочной камеры': ((await readFloat(0x0022, 'VR1', deviceID)) * -0.25).toFixed(1),
    };

    // Чтение импульсных сигналов
    const imVr1 = {
      'ИМ1 скруббер': (await readFloat(0x0044, 'VR1', deviceID)) > 1,
      'ИМ2 ХВО': (await readFloat(0x0046, 'VR1', deviceID)) > 1,
      'ИМ3 аварийный сброс': (await readFloat(0x0048, 'VR1', deviceID)) > 1,
      'ИМ4 пар в отделение активации': (await readFloat(0x004a, 'VR1', deviceID)) > 1,
      'ИМ5 котел-утилизатор': Math.round(await readFloat(0x001c, 'VR1', deviceID)),
    };

    // Чтение данных горелки
    const gorelkaVr1 = {
      'Мощность горелки №1': Math.max(0, Math.round(await readFloat(0x001a, 'VR1', deviceID))),
      'Задание температуры на горелку №1': Math.round(await readFloat(0x002e, 'VR1', deviceID)),
    };

    // Формирование объекта данных
    const formattedDataVr1 = {
      temperatures: temperaturesVr1,
      levels: levelsVr1,
      pressures: pressuresVr1,
      vacuums: vacuumsVr1,
      im: imVr1,
      gorelka: gorelkaVr1,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new PechVr1Model(formattedDataVr1).save();
    // console.log('Данные для VR1:', formattedDataVr1.gorelka);

  } catch (err) {
    console.error('[VR1] Ошибка при чтении данных VR1:', err);
  }
};
