import { Mill10bModel } from '../models/millModel.js';

export const readDataMill10b = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Осевое ШБМ3': 0x0000,
      'Вертикальное ШБМ3': 0x0001,
      'Поперечное ШБМ3': 0x0002,
      'Фронтальное YGM9517': 0x0003,
      'Осевое YGM9517': 0x0004,
      'Поперечное YGM9517': 0x0005,
      'Фронтальное YCVOK130': 0x0006,
      'Поперечное YCVOK130': 0x0007,
      'Осевое YCVOK130': 0x0008,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readInt16(deviceID, address, deviceLabel);
        data[label] = value * 2 ** 16; // Преобразуем int16 в int32
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new Mill10bModel(formattedData).save();
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
