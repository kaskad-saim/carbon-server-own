import { Mill2Model } from '../models/millModel.js';

export const readDataMill2 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const addresses = {
      'Фронтальное Мельница 2': 0x0000,
      'Поперечное Мельница 2': 0x0001,
      'Осевое Мельница 2': 0x0002,
    };

    const data = {};
    for (const [label, address] of Object.entries(addresses)) {
      try {
        const value = await modbusClient.readInt16(deviceID, address, deviceLabel);
        data[label] = Math.round(value * 0.1 * 10) / 10;
      } catch (error) {
        console.error(`[${deviceLabel}] Ошибка чтения с адреса ${address} (${label}):`, error);
      }
    }

    const formattedData = {
      data,
      lastUpdated: new Date(),
    };

    await new Mill2Model(formattedData).save();
    // console.log(formattedData);

  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
