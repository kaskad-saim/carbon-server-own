import { PechMpa3Model } from '../models/pechMpaModel.js';

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
        `[MPA3] Температура для ${label} продолжает значительно изменяться. Принимаем новое значение.`
      );
      previousTemperatures[label] = newTemp;
      temperatureChangeCounters[label] = 0;
      return true;
    } else {
      console.warn(
        `[MPA3] Значительное изменение температуры для ${label}: предыдущее=${previousTemp}, новое=${newTemp}. Последовательных изменений: ${temperatureChangeCounters[label]}`
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

export const readDataMpa3 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    // НЕ вызываем modbusClient.connect();

    // Адреса температур для MPA3
    const temperatureAddresses = {
      'Температура верх регенератора левый МПА3': 0x0000,
      'Температура верх ближний левый МПА3': 0x0001,
      'Температура верх дальний левый МПА3': 0x0002,
      'Температура середина ближняя левый МПА3': 0x0003,
      'Температура середина дальняя левый МПА3': 0x0004,
      'Температура низ ближний левый МПА3': 0x0005,
      'Температура низ дальний левый МПА3': 0x0006,
      'Температура верх регенератора правый МПА3': 0x0007,
      'Температура верх ближний правый МПА3': 0x0008,
      'Температура верх дальний правый МПА3': 0x0009,
      'Температура середина ближняя правый МПА3': 0x000a,
      'Температура середина дальняя правый МПА3': 0x000b,
      'Температура низ ближний правый МПА3': 0x000c,
      'Температура низ дальний правый МПА3': 0x000d,
      'Температура камера сгорания МПА3': 0x000e,
      'Температура дымовой боров МПА3': 0x000f,
    };

    const temperaturesMpa3 = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const rawValue = await modbusClient.readInt16(deviceID, address, deviceLabel);
        const interpretedValue = interpretSignedInt16(rawValue);
        const adjustedValue = Math.round(interpretedValue);

        if (isTemperatureValid(label, adjustedValue)) {
          temperaturesMpa3[label] = adjustedValue;
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
    const pressuresMpa3 = {
      'Разрежение дымовой боров МПА3': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0012, deviceLabel)) * 0.1
      ).toFixed(1),
      'Давление воздух левый МПА3': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0010, deviceLabel))
      ).toFixed(1),
      'Давление воздух правый МПА3': (
        interpretSignedInt16(await modbusClient.readInt16(deviceID, 0x0011, deviceLabel))
      ).toFixed(1),
    };

    // Считывание дополнительных давлений с устройства ID 9
    try {
      const additionalPressures = {
        'Давление низ ближний левый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0000, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление низ ближний правый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0001, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина ближняя левый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0002, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина ближняя правый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0003, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина дальняя левый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0004, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление середина дальняя правый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0005, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление верх дальний левый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0006, deviceLabel)) * 0.1
        ).toFixed(1),
        'Давление верх дальний правый МПА3': (
          interpretSignedInt16(await modbusClient.readInt16(9, 0x0007, deviceLabel)) * 0.1
        ).toFixed(1),
      };

      // Объединяем дополнительные давления в основной объект pressuresMpa3
      Object.assign(pressuresMpa3, additionalPressures);
    } catch (error) {
      console.error(`[${deviceLabel}] Ошибка при чтении данных с устройства ID 9:`, error);
    }

    // Формирование объекта данных
    const formattedDataMpa3 = {
      temperatures: temperaturesMpa3,
      pressures: pressuresMpa3,
      lastUpdated: new Date(),
    };

    // Сохранение данных в базу данных
    await new PechMpa3Model(formattedDataMpa3).save();
    // console.log(formattedDataMpa3);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};


