export class SerialPortSimulator {
  constructor(port) {
    this.port = port;
    this.isConnected = true;
    this.currentValues = {}; // Хранит текущие значения для каждого параметра
    this.devices = {
      NOTIS1: this.notis1,
      NOTIS2: this.notis2,
    };
  }

  async connect() {
    console.log(`Симулятор SerialPort подключен к порту ${this.port}`);
    return Promise.resolve();
  }

  // Симуляция для NOTIS1
  notis1 = {
    indices: {
      1: { label: 'Доза (г)', min: 0, max: 1000, step: 10 },
      5: { label: 'Текущее количество доз (шт)', min: 0, max: 500, step: 5 },
      8: { label: 'Доза (г/мин)', min: 0, max: 200, step: 5 },
    },
  };

  // Симуляция для NOTIS2
  notis2 = {
    indices: {
      1: { label: 'Доза (г)', min: 0, max: 800, step: 8 },
      5: { label: 'Текущее количество доз (шт)', min: 0, max: 400, step: 4 },
      8: { label: 'Доза (г/мин)', min: 0, max: 150, step: 3 },
    },
  };

  async readData(deviceName, index) {
    const device = this.devices[deviceName];
    if (!device || !device.indices[index]) {
      throw new Error(`Индекс ${index} для устройства ${deviceName} не найден`);
    }

    const { min, max, step } = device.indices[index];
    const key = `${deviceName}-${index}`;
    if (!this.currentValues[key]) {
      this.currentValues[key] = this.initializeValue(min, max);
    }

    const change = (Math.random() - 0.5) * step;
    let newValue = this.currentValues[key] + change;

    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;

    this.currentValues[key] = newValue;
    return parseFloat(newValue.toFixed(2));
  }

  initializeValue(min, max) {
    return min + Math.random() * (max - min);
  }
}
