import ModbusRTU from 'modbus-serial';

const modbusClient = new ModbusRTU();
const port = 'COM8';
const baudRate = 57600;
const timeout = 8000; // Таймаут ожидания ответа
const retryInterval = 10000; // Увеличенный интервал повторного подключения
const maxRetries = 20; // Максимальное количество повторных попыток

let isConnected = false;

export const connectModbus = async () => {
  if (isConnected) return; // Предотвращаем повторное подключение, если уже подключено

  try {
    modbusClient.setTimeout(timeout);
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port}`);
    isConnected = true;
  } catch (err) {
    console.error('Ошибка при подключении к Modbus:', err);
    isConnected = false;
    setTimeout(connectModbus, retryInterval); // Повторное подключение через увеличенный интервал
  }
};

export const readFloat = async (address) => {
  if (!modbusClient.isOpen || !isConnected) {
    console.warn('Modbus не подключен. Попытка повторного подключения...');
    await connectModbus();
    await new Promise((resolve) => setTimeout(resolve, retryInterval)); // Ожидание перед новой попыткой подключения
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
      console.error(`Ошибка при чтении данных с адреса ${address}, попытка ${attempts}/${maxRetries}:`, err);

      if (attempts >= maxRetries) {
        console.warn('Превышено максимальное количество попыток чтения. Попытка переподключения...');
        isConnected = false; // Сбрасываем состояние подключения
        await connectModbus();
        attempts = 0; // Сброс счетчика попыток после переподключения
      }

      // Задержка между попытками чтения данных
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
    }
  }
};

export default modbusClient;
