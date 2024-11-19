// services/modbusClient.js
import ModbusRTU from 'modbus-serial';
import { Mutex } from 'async-mutex';

export class ModbusClient {
  constructor(port, baudRate, timeout, retryInterval, maxRetries) {
    this.port = port;
    this.baudRate = baudRate;
    this.timeout = timeout;
    this.retryInterval = retryInterval;
    this.maxRetries = maxRetries;
    this.isConnected = false;
    this.client = new ModbusRTU();
    this.mutex = new Mutex();
  }

  async connect() {
    // Оборачиваем в мьютекс, чтобы избежать одновременных попыток подключения
    return await this.mutex.runExclusive(async () => {
      if (this.isConnected) return;

      try {
        this.client.setTimeout(this.timeout);
        await this.client.connectRTUBuffered(this.port, { baudRate: this.baudRate });
        console.log(`Подключено к порту ${this.port}`);
        this.isConnected = true;
      } catch (err) {
        console.error(`Ошибка подключения к Modbus на порту ${this.port}:`, err);
        this.isConnected = false;
      }
    });
  }

  async readFloat(deviceID, address, deviceLabel = '') {
    return await this.mutex.runExclusive(async () => {
      this.client.setID(deviceID);

      if (!this.client.isOpen || !this.isConnected) {
        console.warn(`[${deviceLabel}] Modbus не подключен на порту ${this.port}. Попытка переподключения...`);
        await this.connect();
        if (!this.isConnected) {
          throw new Error(`Не удалось подключиться к Modbus на порту ${this.port}`);
        }
      }

      let attempts = 0;

      while (attempts < this.maxRetries) {
        try {
          // Логирование попытки чтения
          // console.log(`[${deviceLabel}] Чтение адреса ${address} на порту ${this.port}, попытка ${attempts + 1}/${this.maxRetries}`);
          const data = await this.client.readHoldingRegisters(address, 2);
          const buffer = Buffer.alloc(4);
          buffer.writeUInt16BE(data.data[0], 2);
          buffer.writeUInt16BE(data.data[1], 0);
          return buffer.readFloatBE(0);
        } catch (err) {
          attempts++;
          console.error(`[${deviceLabel}] Ошибка при чтении адреса ${address} на порту ${this.port}, попытка ${attempts}/${this.maxRetries}:`, err);

          if (attempts >= this.maxRetries) {
            console.warn(`[${deviceLabel}] Превышено максимальное количество попыток чтения. Попытка переподключения на порту ${this.port}...`);
            this.isConnected = false;
            await this.connect();
            if (!this.isConnected) {
              throw new Error(`Не удалось переподключиться к Modbus на порту ${this.port}`);
            }
            attempts = 0; // Сбрасываем счетчик попыток после переподключения
          } else {
            // Ждем перед следующей попыткой чтения
            await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
          }
        }
      }
    });
  }
}
