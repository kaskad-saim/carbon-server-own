// sushilka2ModbusService.js

import ModbusRTU from 'modbus-serial';
import { Mutex } from 'async-mutex';
import { Sushilka2Model } from '../models/sushilkaModel.js';

const port = 'COM3';
const baudRate = 57600;
const timeout = 12000;
const retryInterval = 15000;
const maxRetries = 20;
const deviceID = 2;
let isConnected = false;

const modbusClient = new ModbusRTU();
const mutex = new Mutex();

export const connectModbusSushilka2 = async () => {
  if (isConnected) return;

  try {
    modbusClient.setTimeout(timeout);
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port} для Sushilka 2`);
    isConnected = true;
  } catch (err) {
    console.error('Ошибка при подключении к Modbus для Sushilka 2:', err);
    isConnected = false;
    setTimeout(connectModbusSushilka2, retryInterval);
  }
};

const readFloat = async (address) => {
  return await mutex.runExclusive(async () => {
    modbusClient.setID(deviceID);
    if (!isConnected) {
      console.log("Modbus не подключен. Попытка переподключения...");
      await connectModbusSushilka2();
    }

    let attempts = 0;
    while (attempts < maxRetries) {
      try {
        const data = await modbusClient.readHoldingRegisters(address, 2);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(data.data[0], 2);
        buffer.writeUInt16BE(data.data[1], 0);
        const floatValue = buffer.readFloatBE(0);
        return floatValue;
      } catch (err) {
        attempts++;
        console.error(`Ошибка при чтении данных с адреса ${address}, попытка ${attempts}/${maxRetries}:`, err);

        if (attempts >= maxRetries) {
          console.warn('Превышено максимальное количество попыток чтения. Попытка переподключения...');
          isConnected = false;
          await connectModbusSushilka2();
          attempts = 0;
        }

        // Ждём перед следующей попыткой
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
  });
};

export const readDataSushilka2 = async () => {
  try {
    const temperatures = {
      'Температура в топке': Math.round(await readFloat(0x0000, 'Sushilka2', deviceID)),
      'Температура в камере смешения': Math.round(await readFloat(0x0002, 'Sushilka2', deviceID)),
      'Температура уходящих газов': Math.round(await readFloat(0x0004, 'Sushilka2', deviceID)),
    };

    const vacuums = {
      'Разрежение в топке': ((await readFloat(0x0006, 'Sushilka2', deviceID)) * 0.25 - 12.5).toFixed(1),
      'Разрежение в камере выгрузки': ((await readFloat(0x0008, 'Sushilka2', deviceID)) * 0.25).toFixed(1),
      'Разрежение воздуха на разбавление': ((await readFloat(0x000A, 'Sushilka2', deviceID)) * 5).toFixed(1),
    };

    const gorelka = {
      'Мощность горелки': Math.round(await readFloat(0x000C, 'Sushilka2', deviceID)),
      'Сигнал от регулятора': Math.round(await readFloat(0x000E, 'Sushilka2', deviceID)),
      'Задание температуры': Math.round(await readFloat(0x0010, 'Sushilka2', deviceID)),
    };

    const im = {
      'Индикация паротушения': (await readFloat(0x0012, 'Sushilka2', deviceID)) > 1,
      'Индикация сбрасыватель': (await readFloat(0x0014, 'Sushilka2', deviceID)) > 1,
    };

    const formattedData = {
      temperatures,
      vacuums,
      gorelka,
      im,
      lastUpdated: new Date(),
    };

    console.log('Форматированные данные для Sushilka 2:', formattedData);
    // Сохранение данных в базу данных
    await new Sushilka2Model(formattedData).save();
  } catch (error) {
    console.error('Ошибка при чтении данных Sushilka 2:', error);
  }
};


