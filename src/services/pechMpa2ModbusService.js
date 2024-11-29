// services/pechVr1ModbusService.js
import { PechMpa2Model } from '../models/pechMpaModel.js';

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
      console.warn(
        `[MPA2] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`
      );
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0;
      return true;
    } else {
      console.warn(
        `[MPA2] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`
      );
      return false;
    }
  } else {
    temperatureChangeCounters[label] = 0;
    previousTemperatures[label] = newTemp;
    return true;
  }
};

// Функция интерпретации знакового 16-битного числа
const interpretSignedInt16 = (value) => (value >= 0x8000 ? value - 0x10000 : value);

export const readDataMpa2 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    // НЕ вызываем modbusClient.connect();

    // Адреса температур для MPA2
    const temperatureAddresses = {
      'Температура верх регенератора левый МПА2': 0x0000,
      'Температура верх ближний левый МПА2': 0x0001,
      'Температура верх дальний левый МПА2': 0x0002,
      'Температура середина ближняя левый МПА2': 0x0003,
      'Температура середина дальняя левый МПА2': 0x0004,
      'Температура низ ближний левый МПА2': 0x0005,
      'Температура низ дальний левый МПА2': 0x0006,
      'Температура верх регенератора правый МПА2': 0x0007,
      'Температура верх ближний правый МПА2': 0x0008,
      'Температура верх дальний правый МПА2': 0x0009,
      'Температура середина ближняя правый МПА2': 0x000a,
      'Температура середина дальняя правый МПА2': 0x000b,
      'Температура низ ближний правый МПА2': 0x000c,
      'Температура низ дальний правый МПА2': 0x000d,
      'Температура камера сгорания МПА2': 0x000e,
      'Температура дымовой боров МПА2': 0x000f,
    };

    const temperaturesMpa2 = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const rawValue = await modbusClient.readInt16(deviceID, address, deviceLabel);
        const interpretedValue = interpretSignedInt16(rawValue);
        const adjustedValue = Math.round(interpretedValue * 0.1); // Умножаем на 0.1 и округляем

        if (isTemperatureValid(label, adjustedValue)) {
          temperaturesMpa2[label] = adjustedValue;
        } else {
          console.warn(
            `[${deviceLabel}] Пропускаем запись для ${label} из-за подозрительного значения: ${adjustedValue}`
          );
        }
      } catch (error) {
        console.error(
          `[${deviceLabel}] Ошибка при чтении данных с адреса ${address} (${label}):`,
          error
        );
      }
    }

    // Чтение давлений
    const pressuresMpa2 = {
      'Разрежение дымовой боров МПА2': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0012, deviceLabel)) * 0.1
      ).toFixed(1),
      'Давление воздух левый МПА2': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0010, deviceLabel))
      ).toFixed(1), // Без умножения
      'Давление воздух правый МПА2': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0011, deviceLabel))
      ).toFixed(1), // Без умножения
    };

    // Считывание дополнительных давлений с устройства ID 8
    try {
      const additionalPressures = {
        'Давление низ ближний левый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0000, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление низ ближний правый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0001, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина ближняя левый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0002, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина ближняя правый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0003, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина дальняя левый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0004, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина дальняя правый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0005, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление верх дальний левый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0006, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление верх дальний правый МПА2': (
          interpretSignedInt16(await modbusClient.readInt16(8, 0x0007, deviceLabel)) * 0.1
        ).toFixed(1),
      };

      // Объединяем дополнительные давления в основной объект pressuresMpa2
      Object.assign(pressuresMpa2, additionalPressures);
    } catch (error) {
      console.error(`[${deviceLabel}] Ошибка при чтении данных с устройства ID 8:`, error);
    }

    // Формирование объекта данных
    const formattedDataMpa2 = {
      temperatures: temperaturesMpa2,
      pressures: pressuresMpa2,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new PechMpa2Model(formattedDataMpa2).save();
    // console.log(formattedDataMpa2);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};


