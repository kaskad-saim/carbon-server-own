import ModbusRTU from 'modbus-serial';

const modbusClient = new ModbusRTU();
const port = 'COM8';
const baudRate = 57600;
const timeout = 3000; // Увеличенный таймаут в миллисекундах
const retryInterval = 5000; // Интервал повторного подключения
const maxRetries = 3; // Максимальное количество повторных попыток

export const connectModbus = async () => {
  try {
    modbusClient.setTimeout(timeout);
    await modbusClient.connectRTUBuffered(port, { baudRate });
    console.log(`Подключено к порту ${port}`);
  } catch (err) {
    console.error('Ошибка при подключении к Modbus:', err);
    setTimeout(connectModbus, retryInterval); // Повторное подключение через заданный интервал
  }
};

export const readFloat = async (address) => {
  if (!modbusClient.isOpen) {
    console.warn('Modbus не подключен. Попытка повторного подключения...');
    await connectModbus();
  }

  const maxRetries = 3; // Максимальное количество повторных попыток
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
        await connectModbus(); // Попытка переподключения
        attempts = 0; // Сброс счетчика попыток после переподключения
      }

      // Задержка перед повторной попыткой
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};


export default modbusClient;
