import { Mill10bModel } from '../models/millModel.js';

// Функция для интерпретации значений как знаковых 16-битных чисел
const interpretSignedInt16 = (value) => (value >= 0x8000 ? value - 0x10000 : value);

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
        let value = await modbusClient.readInt16(deviceID, address, deviceLabel);
        value = interpretSignedInt16(value); // Корректная интерпретация как signed int16
        data[label] = Math.round(value * 0.1 * 10) / 10;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new Mill10bModel(formattedData).save();
    // console.log(formattedData);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
