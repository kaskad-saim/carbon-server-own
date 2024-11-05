import { readFloat } from './modbusService.js';
import { PechVr2Model } from '../models/pechVrModel.js';

let previousTemperatures = {}; // Объект для хранения предыдущих значений температур

// Функция проверки допустимого изменения температуры
const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];

  if (previousTemp === undefined) {
    previousTemperatures[label] = newTemp; // Первое значение, принимаем его
    return true;
  }

  // Проверка разницы температур
  const tempDifference = Math.abs(newTemp - previousTemp);
  if (tempDifference > 150) {
    console.warn(`[VR2] Слишком большое изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}`);
    return false;
  }

  previousTemperatures[label] = newTemp; // Обновляем предыдущее значение
  return true;
};

export const readDataVr2 = async () => {
  try {
    const deviceID = 4; // ID для VR2

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
      'Газов после скруббера': 0x004c,
      'Воды в ванне скруббера': 0x0014,
      'Гранул после холод-ка': 0x0016,
    };

    const temperaturesVr2 = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await readFloat(address, 'VR2', deviceID));
        if (isTemperatureValid(label, value)) {
          temperaturesVr2[label] = value;
        } else {
          console.warn(`[VR2] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[VR2] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    // Чтение уровней
    const levelsVr2 = {
      'В ванне скруббера': {
        value: Math.round((await readFloat(0x002a, 'VR2', deviceID)) * 10),
        percent: Math.round(await readFloat(0x002a, 'VR2', deviceID)),
      },
      'В емкости ХВО': {
        value: Math.round((await readFloat(0x003e, 'VR2', deviceID)) * 60),
        percent: Math.round(await readFloat(0x003e, 'VR2', deviceID)),
      },
      'В барабане котла': {
        value: Math.round((await readFloat(0x0018, 'VR2', deviceID)) * 4 - 200),
        percent: Math.round(await readFloat(0x0018, 'VR2', deviceID)),
      },
    };

    // Чтение давлений
    const pressuresVr2 = {
      'Давление газов после скруббера': ((await readFloat(0x0028, 'VR2', deviceID)) * 0.25).toFixed(1),
      'Пара в барабане котла': ((await readFloat(0x0026, 'VR2', deviceID)) * 0.16).toFixed(1),
    };

    // Чтение разрежений
    const vacuumsVr2 = {
      'В топке печи': ((await readFloat(0x0020, 'VR2', deviceID)) * 0.25 - 12.5).toFixed(1),
      'В котле утилизаторе': ((await readFloat(0x0024, 'VR2', deviceID)) * -0.25).toFixed(1),
      'Низ загрузочной камеры': ((await readFloat(0x0022, 'VR2', deviceID)) * -0.25).toFixed(1),
    };

    // Чтение импульсных сигналов
    const imVr2 = {
      'ИМ1 скруббер': (await readFloat(0x0044, 'VR2', deviceID)) > 1,
      'ИМ2 ХВО': (await readFloat(0x0046, 'VR2', deviceID)) > 1,
      'ИМ3 аварийный сброс': (await readFloat(0x0048, 'VR2', deviceID)) > 1,
      'ИМ4 пар в отделение активации': (await readFloat(0x004a, 'VR2', deviceID)) > 1,
      'ИМ5 котел-утилизатор': Math.round(await readFloat(0x001c, 'VR2', deviceID)),
    };

    // Чтение данных горелки
    const gorelkaVr2 = {
      'Текущая мощность горелки': Math.max(0, Math.round(await readFloat(0x001a, 'VR2', deviceID))),
      'Задание температуры на горелку': Math.round(await readFloat(0x002e, 'VR2', deviceID)),
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
    // console.log('Данные для VR2:', formattedDataVr2);

  } catch (err) {
    console.error('[VR2] Ошибка при чтении данных VR2:', err);
  }
};
