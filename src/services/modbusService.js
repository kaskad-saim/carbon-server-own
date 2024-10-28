import ModbusRTU from 'modbus-serial';

const modbusClient = new ModbusRTU();
const port = 'COM8';
const baudRate = 57600;

export const connectModbus = async () => {
  try {
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port}`);
  } catch (err) {
    console.error('Ошибка при подключении к Modbus:', err);
  }
};

export const readFloat = async (address) => {
  const data = await modbusClient.readHoldingRegisters(address, 2);
  const buffer = Buffer.alloc(4);
  buffer.writeUInt16BE(data.data[0], 2);
  buffer.writeUInt16BE(data.data[1], 0);
  return buffer.readFloatBE(0);
};

export default modbusClient;
