import { readFloat } from './modbusService.js';
import { Sushilka1Model } from '../models/sushilkaModel.js';

let previousTemperatures = {}; // Хранит предыдущие значения температур
let temperatureChangeCounters = {}; // Хранит количество последовательных значительных изменений

// Функция проверки допустимого изменения температуры
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
      console.warn(`[Sushilka1] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`);
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
      return true;
    } else {
      console.warn(`[Sushilka1] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`);
      return false;
    }
  } else {
    // Изменение температуры в пределах допустимого
    temperatureChangeCounters[label] = 0; // Сбрасываем счетчик
    previousTemperatures[label] = newTemp;
    return true;
  }
};

export const readDataSushilka1 = async () => {
  try {
    const deviceID = 1; // Установите правильный ID для Sushilka1

    // Чтение температур
    const temperatureAddresses = {
      'Температура в топке': 0x0000,
      'Температура в камере смешения': 0x0002,
      'Температура уходящих газов': 0x0004,
    };

    const temperatures = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await readFloat(address, 'Sushilka1', deviceID));
        if (isTemperatureValid(label, value)) {
          temperatures[label] = value;
        } else {
          console.warn(`[Sushilka1] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[Sushilka1] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    // Чтение разрежений
    const vacuums = {
      'Разрежение в топке': ((await readFloat(0x0006, 'Sushilka1', deviceID)) * 0.25 - 12.5).toFixed(1),
      'Разрежение в камере выгрузки': ((await readFloat(0x0008, 'Sushilka1', deviceID)) * 0.25).toFixed(1),
      'Разрежение воздуха на разбавление': ((await readFloat(0x000A, 'Sushilka1', deviceID)) * 5).toFixed(1),
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
