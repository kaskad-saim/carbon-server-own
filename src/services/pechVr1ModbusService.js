import ModbusRTU from 'modbus-serial';
import PechVr1Model from '../models/pechVrModel.js';

const modbusClient = new ModbusRTU();
const port = 'COM8';
const baudRate = 57600;

export const readDataVr1 = async () => {
  try {
    await modbusClient.connectRTUBuffered(port, { baudRate });
    modbusClient.setID(3);
    console.log('Подключено к устройству с адресом 0x03');

    const readFloat = async (address) => {
      const data = await modbusClient.readHoldingRegisters(address, 2);
      const buffer = Buffer.alloc(4);
      buffer.writeUInt16BE(data.data[0], 2);
      buffer.writeUInt16BE(data.data[1], 0);
      return buffer.readFloatBE(0);
    };

    setInterval(async () => {
      try {
        const temperatures = {
          '1-СК': Math.round(await readFloat(0x0002)),
          '2-СК': Math.round(await readFloat(0x0004)),
          '3-СК': Math.round(await readFloat(0x0006)),
          'В топке': Math.round(await readFloat(0x0000)),
          'Вверху камеры загрузки': Math.round(await readFloat(0x0012)),
          'Внизу камеры загрузки': Math.round(await readFloat(0x0008)),
          'На входе печи дожига': Math.round(await readFloat(0x000A)),
          'На выходе печи дожига': Math.round(await readFloat(0x000C)),
          'Камеры выгрузки': Math.round(await readFloat(0x004E)),
          'Дымовых газов котла': Math.round(await readFloat(0x000E)),
          'Газов до скруббера': Math.round(await readFloat(0x0010)),
          'Газов после скруббера': Math.round(await readFloat(0x004C)),
          'Воды в ванне скруббера': Math.round(await readFloat(0x0014)),
          'Гранул после холод-ка': Math.round(await readFloat(0x0016)),
        };

        const levels = {
          'В ванне скруббера': (await readFloat(0x002A)).toFixed(1),
          'В емкости ХВО': (await readFloat(0x003E)).toFixed(1),
          'В барабане котла': (await readFloat(0x0018)).toFixed(1),
        };

        const pressures = {
          'Газов после скруббера': (await readFloat(0x0028)).toFixed(1),
          'Пара в барабане котла': (await readFloat(0x0026)).toFixed(1),
        };

        const vacuums = {
          'В топке печи': (await readFloat(0x0020)).toFixed(1),
          'В котле утилизаторе': (await readFloat(0x0024)).toFixed(1),
          'Низ загрузочной камеры': (await readFloat(0x0022)).toFixed(1),
        };

        const im = {
          'ИМ1 скруббер': (await readFloat(0x0044)) > 1,
          'ИМ2 ХВО': (await readFloat(0x0046)) > 1,
          'ИМ3 аварийный сброс': (await readFloat(0x0048)) > 1,
          'ИМ4 пар в отделение активации': (await readFloat(0x004A)) > 1,
          'ИМ5 котел-утилизатор': Math.round(await readFloat(0x001C))
        };

        const gorelka = {
          'Текущая мощность горелки': Math.max(0, Math.round(await readFloat(0x001A))),
          'Задание температуры на горелку': Math.round(await readFloat(0x002E)),
        };

        const formattedData = {
          temperatures,
          levels,
          pressures,
          vacuums,
          im,
          gorelka,
          lastUpdated: new Date(),
        };

        const newRecord = new PechVr1Model(formattedData);
        await newRecord.save();
        console.log('Данные сохранены в MongoDB:', formattedData);
      } catch (err) {
        console.error('Ошибка при чтении данных:', err);
      }
    }, 10000);
  } catch (err) {
    console.error('Ошибка при подключении:', err);
  }
};
