import { Vr1TimeCounterModel } from '../models/vr1TimeCounterModel.js';
import logger from '../logger.js';

export const readVr1TimeCounter = async (modbusClient, deviceID, deviceLabel) => {
  try {
    const TIME_REGISTER = 0x16; // Адрес регистра времени

    // Чтение значения из Modbus
    const value = await modbusClient.readInt32(deviceID, TIME_REGISTER, deviceLabel);

    // Форматирование времени
    const formattedTime = formatTime(value);

    // Сохранение в базу данных
    const savedData = await new Vr1TimeCounterModel({
      currentTime: formattedTime,
      lastUpdated: new Date()
    }).save();

    // console.log(`[${deviceLabel}] Данные сохранены в БД:`, savedData);

    logger.info(`[${deviceLabel}] Время успешно обновлено: ${formattedTime}`);
  } catch (err) {
    console.error(`[${deviceLabel}] Ошибка:`, err.message);
    logger.error(`[${deviceLabel}] Ошибка чтения времени: ${err.message}`);
    throw err;
  }
};

function formatTime(secondsSinceMidnight) {
  const hours = Math.floor(secondsSinceMidnight / 3600);
  const minutes = Math.floor((secondsSinceMidnight % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}`;
}

function pad(num) {
  return num.toString().padStart(2, '0');
}