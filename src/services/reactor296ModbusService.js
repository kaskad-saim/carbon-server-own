// services/reactorModbusService.js

import { Reactor296Model } from '../models/reactor296Model.js';

export const readDataReactorK296 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const temperatureAddresses = {
      'Температура реактора 45/1': 0x0000,
      'Температура реактора 45/2': 0x0002,
      'Температура реактора 45/3': 0x0004,
      'Температура реактора 45/4': 0x0006,
    };

    const levelAddresses = {
      'Уровень реактора 45/1': 0x0008,
      'Уровень реактора 45/2': 0x000A,
      'Уровень реактора 45/3': 0x000C,
      'Уровень реактора 45/4': 0x000E,
    };

    const temperatures = {};
    const levels = {};

    for (const [label, address] of Object.entries(temperatureAddresses)) {
      try {
        const value = await modbusClient.readFloat(deviceID, address, deviceLabel);
        temperatures[label] = parseFloat(value.toFixed(0));
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка при чтении температуры с адреса ${address} (${label}):`, error);
      }
    }

    for (const [label, address] of Object.entries(levelAddresses)) {
      try {
        const value = await modbusClient.readFloat(deviceID, address, deviceLabel);
        levels[label] = parseFloat(value.toFixed(0));
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка при чтении уровня с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      temperatures,
      levels,
      lastUpdated: new Date(),
    };

    await new Reactor296Model(formattedData).save();
    // console.log(formattedData);

  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
