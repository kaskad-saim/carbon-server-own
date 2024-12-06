// services/serialPortSimulator.js
import EventEmitter from 'events';
import logger from '../logger.js';
import { serialDevicesConfig } from './devicesConfig.js';

export class SerialPortSimulator extends EventEmitter {
  constructor(port) {
    super();
    this.port = port;
    this.isConnected = false;
    this.currentValues = {};

    // Фильтруем устройства, связанные с этим портом
    this.devices = serialDevicesConfig.filter(device => device.port === port);
    this.interval = null;
  }

  async connect() {
    this.isConnected = true;
    logger.info(`Симулятор SerialPort подключен к порту ${this.port}`);

    // Начинаем генерацию данных
    this.startSimulation();
    return Promise.resolve();
  }

  async disconnect() {
    this.isConnected = false;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    logger.info(`Симулятор SerialPort отключен от порта ${this.port}`);
    return Promise.resolve();
  }

  startSimulation() {
    if (this.interval) return;

    this.interval = setInterval(() => {
      this.devices.forEach(device => {
        // Проверяем, что устройство имеет name и address
        if (!device.name || typeof device.address === 'undefined') {
          logger.error(`Устройство с портом ${this.port} имеет некорректную конфигурацию:`, device);
          return;
        }

        // Генерация данных для каждого устройства
        const data = this.generateData(device);
        this.emit('data', data);
      });
    }, 1000); // Генерация данных каждую секунду
  }

  generateData(device) {
    const { name, address } = device;
    // Генерация случайного значения в зависимости от типа устройства или адреса
    const value = this.generateRandomValue(name, address);

    // Формат данных может быть адаптирован под вашу реализацию
    const data = {
      deviceName: name,
      address: address,
      value: value,
      timestamp: new Date(),
    };

    logger.debug(`Симулятор ${name} на порту ${this.port} генерирует данные:`, data);
    return data;
  }

  generateRandomValue(deviceName, address) {
    // Настройте генерацию случайных значений в зависимости от устройства и адреса
    // Пример:
    if (address === 1) {
      return Math.round(Math.random() * 100); // Доза (г)
    } else if (address === 5) {
      return Math.floor(Math.random() * 100); // Текущее количество доз (шт)
    } else if (address === 8) {
      return Math.round(Math.random() * 10); // Доза (г/мин)
    }
    // Добавьте другие адреса по необходимости
    return Math.round(Math.random() * 100);
  }

  // Метод для чтения данных, аналогичный реальному SerialPort
  async readData(deviceName, address) {
    // Возвращаем сгенерированное значение
    const data = this.generateData({ name: deviceName, address: address });
    return data.value;
  }
}
