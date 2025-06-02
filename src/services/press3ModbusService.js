import { Press3Model } from '../models/pressK296Model.js';

export const readDataPress3 = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const controllerData = {
      'Статус работы': await modbusClient.readCoil(deviceID, 0x4800 + 4, deviceLabel),
      'Кол-во наработанных часов': await modbusClient.readInt16(deviceID, 0x3800 + 338, deviceLabel),
    };

    const rawTemp  = await modbusClient.readInt16(0x07, 0x0004, deviceLabel);
    const rawPress = await modbusClient.readInt16(0x07, 0x0002, deviceLabel);

    const termodatData = {
      'Температура масла': Math.round(rawTemp  * 0.1 * 10) / 10,
      'Давление масла':    Math.round(rawPress * 0.1 * 10) / 10,
    };

    const formattedData = {
      controllerData,
      termodatData,
      lastUpdated: new Date(),
    };

    await new Press3Model(formattedData).save();
    // console.log(formattedData);

  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка при чтении данных:`, err);
  }
};
