import modbusClient, { readFloat } from './modbusService.js';
import { Sushilka2Model } from '../models/sushilkaModels.js';

let previousTemperatures = {}; // Объект для хранения предыдущих значений температур

const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];

  if (previousTemp === undefined) {
    previousTemperatures[label] = newTemp;
    return true;
  }

  const tempDifference = Math.abs(newTemp - previousTemp);
  if (tempDifference > 100) {
    console.warn(`[Sushilka2] Слишком большое изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}`);
    return false;
  }

  previousTemperatures[label] = newTemp;
  return true;
};

export const readDataSushilka2 = async () => {
  try {
    modbusClient.setID(2); // Устанавливаем ID для Sushilka2

    const temperatureAddresses = {
      'Температура в топке': 0x0000,
      'Температура в камере смешения': 0x0002,
      'Температура уходящих газов': 0x0006,
    };

    const temperaturesSushilka2 = {};
    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await readFloat(address, 'Sushilka2'));
        if (isTemperatureValid(label, value)) {
          temperaturesSushilka2[label] = value;
        } else {
          console.warn(`[Sushilka2] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[Sushilka2] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    const vacuumsSushilka2 = {
      'Разрежение в топке': ((await readFloat(0x000A, 'Sushilka2'))).toFixed(1),
      'Разрежение в камере выгрузки': ((await readFloat(0x000C, 'Sushilka2'))).toFixed(1),
      'Разрежение воздуха на разбавление': ((await readFloat(0x000E, 'Sushilka2'))).toFixed(1),
    };

    const gorelkaSushilka2 = {
      'Мощность горелки': Math.max(0, Math.round(await readFloat(0x0010, 'Sushilka2'))),
      'Сигнал от регулятора': Math.round(await readFloat(0x0012, 'Sushilka2')),
      'Задание температуры': Math.round(await readFloat(0x0014, 'Sushilka2')),
    };

    const imSushilka2 = {
      'Индикация паротушения': (await readFloat(0x001E, 'Sushilka2')) > 1,
      'Индикация сбрасыватель': (await readFloat(0x0020, 'Sushilka2')) > 1,
    };

    const formattedDataSushilka2 = {
      temperatures: temperaturesSushilka2,
      vacuums: vacuumsSushilka2,
      gorelka: gorelkaSushilka2,
      im: imSushilka2,
      lastUpdated: new Date(),
    };

    await new Sushilka2Model(formattedDataSushilka2).save();
    console.log('Данные для Sushilka2:', formattedDataSushilka2);
  } catch (err) {
    console.error('[Sushilka2] Ошибка при чтении данных Sushilka2:', err);
  }
};
