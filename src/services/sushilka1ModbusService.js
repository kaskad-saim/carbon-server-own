import { readFloat } from './modbusService.js';
import { Sushilka1Model } from '../models/sushilkaModel.js';

export const readDataSushilka1 = async () => {
  try {
    const deviceID = 1; // Установите правильный ID для Sushilka1

    // Чтение температур
    const temperatures = {
      'Температура в топке': Math.round(await readFloat(0x0000, 'Sushilka1', deviceID)),
      'Температура в камере смешения': Math.round(await readFloat(0x0002, 'Sushilka1', deviceID)),
      'Температура уходящих газов': Math.round(await readFloat(0x0004, 'Sushilka1', deviceID)),
    };

    // Чтение разрежений
    const vacuums = {
      'Разрежение в топке': ((await readFloat(0x0006, 'Sushilka1', deviceID)) * 0.25 - 12.5).toFixed(1),
      'Разрежение в камере выгрузки': ((await readFloat(0x0008, 'Sushilka1', deviceID)) * 0.25 - 12.5).toFixed(1),
      'Разрежение воздуха на разбавление': ((await readFloat(0x000A, 'Sushilka1', deviceID)) * 0.25 - 12.5).toFixed(1),
    };

    // Чтение данных горелки
    const gorelka = {
      'Мощность горелки': Math.round(await readFloat(0x000C, 'Sushilka1', deviceID)),
      'Сигнал от регулятора': Math.round(await readFloat(0x000E, 'Sushilka1', deviceID)),
      'Задание температуры': Math.round(await readFloat(0x0010, 'Sushilka1', deviceID)),
    };

    // Чтение импульсных сигналов
    const im = {
      'Индикация паротушения': (await readFloat(0x0012, 'Sushilka1', deviceID)) > 1,
      'Индикация сбрасыватель': (await readFloat(0x0014, 'Sushilka1', deviceID)) > 1,
    };

    // Формирование объекта данных
    const formattedData = {
      temperatures,
      vacuums,
      gorelka,
      im,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new Sushilka1Model(formattedData).save();
    // console.log('Данные для Sushilka1:', formattedData);
  } catch (err) {
    console.error('Ошибка при чтении данных Sushilka1:', err);
  }
};
