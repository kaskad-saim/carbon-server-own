// services/pechVr1ModbusService.js
import modbusClient, { readFloat } from './modbusService.js';
import { PechVr1Model } from '../models/pechVrModel.js';

export const readDataVr1 = async () => {
  try {
    modbusClient.setID(3); // Устанавливаем ID для VR1

    // Чтение температур
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
      'Газов после скруббера': ((await readFloat(0x0028)) * 0.25).toFixed(1),
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
    // console.log('Данные для VR1 сохранены:', formattedDataVr1);
  } catch (err) {
    console.error('Ошибка при чтении данных VR1:', err);
  }
};
