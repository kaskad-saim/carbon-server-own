import ModbusRTU from 'modbus-serial';

const modbusClient = new ModbusRTU();
const port = 'COM8';
const baudRate = 57600;
const timeout = 12000;
const retryInterval = 15000;
const maxRetries = 20;

let isConnected = false;

export const connectModbus = async () => {
  if (isConnected) return;

  try {
    modbusClient.setTimeout(timeout);
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port}`);
    isConnected = true;
  } catch (err) {
    console.error('Ошибка при подключении к Modbus:', err);
    isConnected = false;
    setTimeout(connectModbus, retryInterval);
  }
};

export const readFloat = async (address, deviceLabel = '') => {
  if (!modbusClient.isOpen || !isConnected) {
    console.warn(`[${deviceLabel}] Modbus не подключен. Попытка повторного подключения...`);
    await connectModbus();
    await new Promise((resolve) => setTimeout(resolve, retryInterval));
  }

  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const data = await modbusClient.readHoldingRegisters(address, 2);
      const buffer = Buffer.alloc(4);
      buffer.writeUInt16BE(data.data[0], 2);
      buffer.writeUInt16BE(data.data[1], 0);
      return buffer.readFloatBE(0);
    } catch (err) {
      attempts++;
      console.error(`[${deviceLabel}] Ошибка при чтении данных с адреса ${address}, попытка ${attempts}/${maxRetries}:`, err);

      if (attempts >= maxRetries) {
        console.warn(`[${deviceLabel}] Превышено максимальное количество попыток чтения. Попытка переподключения...`);
        isConnected = false;
        await connectModbus();
        attempts = 0;
      }

      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
};

export default modbusClient;
