import modbusClient, { readFloat } from './modbusService.js';
import { PechVr1Model } from '../models/pechVrModel.js';

let previousTemperatures = {}; // Объект для хранения предыдущих значений температур

// Функция проверки допустимого изменения температуры
const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];
  if (previousTemp === undefined) {
    // Если это первое значение, принимаем его как валидное
    previousTemperatures[label] = newTemp;
    return true;
  }
  // Проверяем, не слишком ли велико изменение температуры
  const tempDifference = Math.abs(newTemp - previousTemp);
  if (tempDifference > 100) {
    console.warn(`Слишком большое изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}`);
    return false;
  }
  // Обновляем предыдущее значение, если новое значение допустимо
  previousTemperatures[label] = newTemp;
  return true;
};

export const readDataVr1 = async () => {
  try {
    modbusClient.setID(3); // Устанавливаем ID для VR1

    // Чтение температур с проверкой валидности
    const temperaturesVr1 = {
      '1-СК': Math.round(await readFloat(0x0002)),
      '2-СК': Math.round(await readFloat(0x0004)),
      '3-СК': Math.round(await readFloat(0x0006)),
      'В топке': Math.round(await readFloat(0x0000)),
      'Вверху камеры загрузки': Math.round(await readFloat(0x0012)),
      'Внизу камеры загрузки': Math.round(await readFloat(0x0008)),
      'На входе печи дожига': Math.round(await readFloat(0x000a)),
      'На выходе печи дожига': Math.round(await readFloat(0x000c)),
      'Камеры выгрузки': Math.round(await readFloat(0x004e)),
      'Дымовых газов котла': Math.round(await readFloat(0x000e)),
      'Газов до скруббера': Math.round(await readFloat(0x0010)),
      'Газов после скруббера': Math.round(await readFloat(0x004c)),
      'Воды в ванне скруббера': Math.round(await readFloat(0x0014)),
      'Гранул после холод-ка': Math.round(await readFloat(0x0016)),
    };

    // Проверка всех значений температуры
    for (const [label, value] of Object.entries(temperaturesVr1)) {
      if (!isTemperatureValid(label, value)) {
        console.warn(`Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        delete temperaturesVr1[label]; // Удаляем подозрительное значение
      }
    }

    // Чтение уровней
    const levelsVr1 = {
      'В ванне скруббера': {
        value: Math.round((await readFloat(0x002a)) * 10),
        percent: Math.round(await readFloat(0x002a)),
      },
      'В емкости ХВО': {
        value: Math.round((await readFloat(0x003e)) * 60),
        percent: Math.round(await readFloat(0x003e)),
      },
      'В барабане котла': {
        value: Math.round((await readFloat(0x0018)) * 4 - 200),
        percent: Math.round(await readFloat(0x0018)),
      },
    };

    // Чтение давлений
    const pressuresVr1 = {
      'Давление газов после скруббера': ((await readFloat(0x0028)) * 0.25).toFixed(1),
      'Пара в барабане котла': ((await readFloat(0x0026)) * 0.16).toFixed(1),
    };

    // Чтение разрежений
    const vacuumsVr1 = {
      'В топке печи': ((await readFloat(0x0020)) * 0.25 - 12.5).toFixed(1),
      'В котле утилизаторе': ((await readFloat(0x0024)) * -0.25).toFixed(1),
      'Низ загрузочной камеры': ((await readFloat(0x0022)) * -0.25).toFixed(1),
    };

    // Чтение импульсных сигналов
    const imVr1 = {
      'ИМ1 скруббер': (await readFloat(0x0044)) > 1,
      'ИМ2 ХВО': (await readFloat(0x0046)) > 1,
      'ИМ3 аварийный сброс': (await readFloat(0x0048)) > 1,
      'ИМ4 пар в отделение активации': (await readFloat(0x004a)) > 1,
      'ИМ5 котел-утилизатор': Math.round(await readFloat(0x001c)),
    };

    // Чтение данных горелки
    const gorelkaVr1 = {
      'Текущая мощность горелки': Math.max(0, Math.round(await readFloat(0x001a))),
      'Задание температуры на горелку': Math.round(await readFloat(0x002e)),
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
    // console.log('Данные для VR1 успешно сохранены:', formattedDataVr1);
  } catch (err) {
    console.error('Ошибка при чтении данных VR1:', err);
  }
};
