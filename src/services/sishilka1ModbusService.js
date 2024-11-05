import { Sushilka1Model } from "../models/sushilkaModels.js";
import modbusClient, { readFloat } from "./modbusService.js";


let previousTemperatures = {}; // Объект для хранения предыдущих значений температур

const isTemperatureValid = (label, newTemp) => {
  const previousTemp = previousTemperatures[label];

  if (previousTemp === undefined) {
    previousTemperatures[label] = newTemp;
    return true;
  }

  const tempDifference = Math.abs(newTemp - previousTemp);
  if (tempDifference > 100) {
    console.warn(`[Sushilka1] Слишком большое изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}`);
    return false;
  }

  previousTemperatures[label] = newTemp;
  return true;
};

export const readDataSushilka1 = async () => {
  try {
    modbusClient.setID(1); // Устанавливаем ID для Sushilka1

    const temperatureAddresses = {
      'Температура в топке': 0x0000,
      'Температура в камере смешения': 0x0002,
      'Температура уходящих газов': 0x0006,
    };

    const temperaturesSushilka1 = {};
    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = Math.round(await readFloat(address, 'Sushilka1'));
        if (isTemperatureValid(label, value)) {
          temperaturesSushilka1[label] = value;
        } else {
          console.warn(`[Sushilka1] Пропускаем запись для ${label} из-за подозрительного значения: ${value}`);
        }
      } catch (error) {
        console.error(`[Sushilka1] Ошибка при чтении данных с адреса ${address} (${label}):`, error);
      }
    }

    const vacuumsSushilka1 = {
      'Разрежение в топке': ((await readFloat(0x000A, 'Sushilka1'))).toFixed(1),
      'Разрежение в камере выгрузки': ((await readFloat(0x000C, 'Sushilka1'))).toFixed(1),
      'Разрежение воздуха на разбавление': ((await readFloat(0x000E, 'Sushilka1'))).toFixed(1),
    };

    const gorelkaSushilka1 = {
      'Мощность горелки': Math.max(0, Math.round(await readFloat(0x0010, 'Sushilka1'))),
      'Сигнал от регулятора': Math.round(await readFloat(0x0012, 'Sushilka1')),
      'Задание температуры': Math.round(await readFloat(0x0014, 'Sushilka1')),
    };

    const imSushilka1 = {
      'Индикация паротушения': (await readFloat(0x001E, 'Sushilka1')) > 1,
      'Индикация сбрасыватель': (await readFloat(0x0020, 'Sushilka1')) > 1,
    };

    const formattedDataSushilka1 = {
      temperatures: temperaturesSushilka1,
      vacuums: vacuumsSushilka1,
      gorelka: gorelkaSushilka1,
      im: imSushilka1,
      lastUpdated: new Date(),
    };

    await new Sushilka1Model(formattedDataSushilka1).save();
    console.log('Данные для Sushilka1:', formattedDataSushilka1);
  } catch (err) {
    console.error('[Sushilka1] Ошибка при чтении данных Sushilka1:', err);
  }
};
