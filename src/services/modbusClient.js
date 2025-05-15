// modbusClient.js
import ModbusRTU from 'modbus-serial';
import { Mutex } from 'async-mutex';
import logger from '../logger.js';

export class ModbusClient {
  constructor(port, baudRate, timeout, retryInterval, maxRetries, unstable = false) {
    this.port = port;
    this.baudRate = baudRate;
    this.timeout = timeout;
    this.retryInterval = retryInterval;
    this.maxRetries = maxRetries;
    this.unstable = unstable;
    this.isConnected = false;
    this.client = new ModbusRTU();
    this.mutex = new Mutex();
    this.reconnecting = false; // Флаг для предотвращения одновременных попыток переподключения

    // Настройка параметров для нестабильных портов
    if (this.unstable) {
      this.retryInterval *= 2;
      this.maxRetries *= 2;
      this.client.setTimeout(this.timeout * 2);
    } else {
      this.client.setTimeout(this.timeout);
    }

    // Обработка событий клиента
    this.client.on('close', () => this.handleDisconnect('close'));
    this.client.on('timeout', () => this.handleDisconnect('timeout'));
    this.client.on('end', () => this.handleDisconnect('end'));
    this.client.on('error', (err) => this.handleError(err));
  }

  // Подключение к Modbus
  async connect() {
    return await this.mutex.runExclusive(async () => {
      if (this.isConnected || this.reconnecting) return;

      this.reconnecting = true;
      try {
        logger.info(`Попытка подключения к порту ${this.port}...`);
        await this.client.connectRTUBuffered(this.port, { baudRate: this.baudRate });
        logger.info(`Подключено к порту ${this.port}`);
        this.isConnected = true;
      } catch (err) {
        logger.error(`Ошибка подключения к Modbus на порту ${this.port}:`, err);
        this.isConnected = false;
        await this.scheduleReconnect();
      } finally {
        this.reconnecting = false;
      }
    });
  }

  async disconnect() {
    return await this.mutex.runExclusive(async () => {
      if (!this.isConnected) {
        logger.info(`Соединение с портом ${this.port} уже закрыто.`);
        return;
      }

      try {
        await this.client.close(); // Закрытие соединения с Modbus
        this.isConnected = false;
        logger.info(`Соединение с портом ${this.port} успешно закрыто.`);
      } catch (err) {
        logger.error(`Ошибка при закрытии соединения с портом ${this.port}:`, err);
      }
    });
  }

  // Обработка событий разрыва соединения
  async handleDisconnect(reason) {
    logger.warn(`Соединение с портом ${this.port} потеряно (${reason}). Попытка переподключения...`);
    this.isConnected = false;
    await this.safeReconnect();
  }

  // Обработка ошибок
  async handleError(err) {
    logger.error(`Ошибка на порту ${this.port}:`, err);
    this.isConnected = false;
    await this.safeReconnect();
  }

  // Безопасное переподключение
  async safeReconnect() {
    if (this.reconnecting) {
      logger.info(`Переподключение к порту ${this.port} уже выполняется.`);
      return;
    }

    this.reconnecting = true;
    try {
      await this.disconnect();
      await this.connect();
    } catch (err) {
      logger.error(`Ошибка переподключения к порту ${this.port}:`, err);
    } finally {
      this.reconnecting = false;
    }
  }

  // Запланированное переподключение
  async scheduleReconnect() {
    if (this.reconnecting) {
      logger.info(`Переподключение к порту ${this.port} уже запланировано.`);
      return;
    }
    this.reconnecting = true;

    logger.info(`Попытка переподключения к порту ${this.port} через ${this.retryInterval} мс...`);
    setTimeout(async () => {
      try {
        await this.connect();
      } catch (err) {
        logger.error(`Не удалось переподключиться к порту ${this.port}:`, err);
      } finally {
        this.reconnecting = false;
      }
    }, this.retryInterval);
  }

  // Универсальный метод для выполнения операций чтения
    async executeRead(operation, deviceID, address, deviceLabel) {
      let attempts = 0;

      while (attempts < this.maxRetries) {
          try {
              if (!this.isConnected) {
                  logger.warn(`[${deviceLabel}] Modbus не подключен на порту ${this.port}. Попытка подключения...`);
                  await this.connect();
                  if (!this.isConnected) {
                      throw new Error(`Не удалось подключиться к Modbus на порту ${this.port}`);
                  }
              }

              // Тайм-аут на выполнение операции
              return await Promise.race([
                  this.mutex.runExclusive(async () => {
                      this.client.setID(deviceID);
                      return await operation();
                  }),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('Тайм-аут операции')), this.timeout))
              ]);
          } catch (err) {
              attempts++;
              logger.error(
                  `[${deviceLabel}] Ошибка при выполнении операции на адресе ${address} на порту ${this.port}, попытка ${attempts}/${this.maxRetries}:`,
                  err
              );

              if (attempts >= this.maxRetries) {
                  logger.warn(`[${deviceLabel}] Превышено максимальное количество попыток.`);
                  throw err; // Позволяем ошибке всплыть
              } else {
                  await new Promise((resolve) => setTimeout(resolve, this.retryInterval));
              }
          }
      }
  }

  async readFloat(deviceID, address, deviceLabel = '') {
    return await this.executeRead(
      async () => {
        const data = await this.client.readHoldingRegisters(address, 2);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(data.data[0], 2);
        buffer.writeUInt16BE(data.data[1], 0);
        return buffer.readFloatBE(0);
      },
      deviceID,
      address,
      deviceLabel
    );
  }

  async readFloatLE(deviceID, address, deviceLabel = '') {
    return await this.executeRead(
      async () => {
        const data = await this.client.readInputRegisters(address, 2);
        const buffer = Buffer.alloc(4);

        // Записываем данные в порядке Little Endian:
        // Младшее слово (data.data[1]) первым, старшее слово (data.data[0]) вторым
        buffer.writeUInt16LE(data.data[1], 0); // Младшее слово
        buffer.writeUInt16LE(data.data[0], 2); // Старшее слово

        // Чтение как Float (Little Endian)
        return buffer.readFloatLE(0);
      },
      deviceID,
      address,
      deviceLabel
    );
  }

  async readFloatBE(deviceID, address, deviceLabel = '') {
    return await this.executeRead(
      async () => {
        const data = await this.client.readInputRegisters(address, 2);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(data.data[0], 2);
        buffer.writeUInt16BE(data.data[1], 0);
        return buffer.readFloatBE(0);
      },
      deviceID,
      address,
      deviceLabel
    );
  }



  async readInt16(deviceID, address, deviceLabel = '') {
    return await this.executeRead(
      async () => {
        const data = await this.client.readHoldingRegisters(address, 1);
        return data.data[0];
      },
      deviceID,
      address,
      deviceLabel
    );
  }

  async readInt32(deviceID, address, deviceLabel = '') {
    return await this.executeRead(
      async () => {
        const data = await this.client.readHoldingRegisters(address, 2);
        const buffer = Buffer.alloc(4);
        buffer.writeUInt16BE(data.data[0], 0); // Старшие байты
        buffer.writeUInt16BE(data.data[1], 2); // Младшие байты
        return buffer.readInt32BE(0);
      },
      deviceID,
      address,
      deviceLabel
    );
  }

  async readCoil(deviceID, address, label = '') {
    const res = await this.executeRead(
      () => this.client.readCoils(address, 1),
      deviceID,
      address,
      label || `Coil@${address}`
    );
    return res.data[0];
  }
}
