export class ModbusSimulator {
  constructor(port) {
    this.port = port;
    this.isConnected = true;
    this.currentValues = {}; // Хранит текущие значения для каждого параметра
  }

  async connect() {
    console.log(`Симулятор Modbus подключен к порту ${this.port}`);
    return Promise.resolve();
  }

  // Объекты для каждого типа оборудования
  pechiVr = {
    temperatureAddressesList: [
      0x0000, 0x0002, 0x0004, 0x0006, 0x0008, 0x0012, 0x000A, 0x000C, 0x004E, 0x000E, 0x0010, 0x004C, 0x0014, 0x0016
    ],
    pressureAddressesList: [
      0x0026, 0x0028
    ],
    vacuumAddressesList: [
      0x0020, 0x0022, 0x0024
    ],
    levelAddressesList: [
      0x0018, 0x002A, 0x003E
    ],
    imAddressesList: [
      0x0044, 0x0046, 0x0048, 0x004A, 0x001C
    ],
    gorelkaAddressesList: [
      0x001A, 0x002E
    ],
    getRange(address, label = '') {
      if (this.temperatureAddressesList.includes(address)) return { min: 0, max: 1500, step: 50 };
      if (this.pressureAddressesList.includes(address)) return { min: 0, max: 30, step: 5 };
      if (this.vacuumAddressesList.includes(address)) return { min: -20, max: 0, step: 5 };
      if (this.levelAddressesList.includes(address)) {
        if (label === 'В ванне скруббера') return { min: 0, max: 1000, step: 50 };
        if (label === 'В емкости ХВО') return { min: 0, max: 6000, step: 100 };
        return { min: -100, max: 100, step: 20 };
      }
      if (this.imAddressesList.includes(address)) return { min: 0, max: 1, step: 1 };
      if (this.gorelkaAddressesList.includes(address)) return { min: 0, max: 100, step: 10 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  sushilki = {
    temperatureAddressesList: [
      0x0000, 0x0002, 0x0006
    ],
    vacuumAddressesList: [
      0x000A, 0x000C, 0x000E
    ],
    imAddressesList: [
      0x001E, 0x0020
    ],
    gorelkaAddressesList: [
      0x0010, 0x0012, 0x0014
    ],
    getRange(address, label = '') {
      if (this.temperatureAddressesList.includes(address)) return { min: 0, max: 600, step: 50 };
      if (this.vacuumAddressesList.includes(address)) return { min: -20, max: 0, step: 5 };
      if (this.imAddressesList.includes(address)) return { min: 0, max: 1, step: 1 };
      if (this.gorelkaAddressesList.includes(address)) return { min: 0, max: 100, step: 10 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  mpa = {
    temperatureAddressesList: [
      0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008, 0x0009, 0x000A, 0x000B, 0x000C, 0x000D, 0x000E, 0x000F
    ],
    pressureAddressesList: [
      0x0010, 0x0011, 0x0012
    ],
    vacuumAddressesList: [
      0x0012, 0x0010, 0x0011
    ],
    getRange(address) {
      if (this.temperatureAddressesList.includes(address)) return { min: 0, max: 1200, step: 50 };
      if (this.pressureAddressesList.includes(address)) return { min: 0, max: 150, step: 5 };
      if (this.vacuumAddressesList.includes(address)) return { min: -30, max: 0, step: 5 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  mills = {
    millAddressesList: [
      0x0000, 0x0001, 0x0002
    ],
    getRange(address) {
      if (this.millAddressesList.includes(address)) return { min: 0, max: 30, step: 1 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  mill10b = {
    millAddressesList: [
      0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005, 0x0006, 0x0007, 0x0008
    ],
    getRange(address) {
      if (this.millAddressesList.includes(address)) return { min: 0, max: 30, step: 1 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  reactor296 = {
    temperatureAddressesList: [
      0x0000, 0x0002, 0x0004, 0x0006
    ],
    levelAddressesList: [
      0x0008, 0x000A, 0x000C, 0x000E
    ],
    getRange(address) {
      if (this.temperatureAddressesList.includes(address)) return { min: 0, max: 100, step: 10 };
      if (this.levelAddressesList.includes(address)) return { min: 0, max: 2500, step: 50 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  // Метод для чтения значений с учётом объекта и диапазона
  async readFloat(deviceID, address, deviceLabel = '') {
    let range = null;

    // Проверка диапазонов для всех объектов
    if (this.pechiVr.getRange(address, deviceLabel)) range = this.pechiVr.getRange(address, deviceLabel);
    if (this.sushilki.getRange(address, deviceLabel)) range = this.sushilki.getRange(address, deviceLabel);
    if (this.mpa.getRange(address)) range = this.mpa.getRange(address);
    if (this.mills.getRange(address)) range = this.mills.getRange(address);
    if (this.mill10b.getRange(address)) range = this.mill10b.getRange(address);
    if (this.reactor296.getRange(address)) range = this.reactor296.getRange(address);

    // Если диапазон не найден, устанавливаем дефолтное значение
    if (!range) range = { min: 0, max: 100, step: 10 };

    const key = `${deviceID}-${address}`;
    if (!this.currentValues[key]) {
      this.currentValues[key] = this.initializeValue(range.min, range.max);
    }

    const maxStep = range.step || 50;

    // Генерация случайного изменения в пределах диапазона
    const change = (Math.random() - 0.5) * Math.min(maxStep, range.max - range.min);  // Ограничиваем изменение

    let newValue = this.currentValues[key] + change;

    // Проверка на выход за пределы диапазона
    if (newValue > range.max) newValue = range.max;
    if (newValue < range.min) newValue = range.min;

    // Логирование изменений
    // console.log(`Старое значение: ${this.currentValues[key]}, Изменение: ${change}, Новое значение: ${newValue}`);

    this.currentValues[key] = newValue;
    return parseFloat(newValue.toFixed(2));  // Возвращаем значение с двумя знаками после запятой
  }

  // Метод для чтения int16 значений
  async readInt16(deviceID, address) {
    let range = null;

    // Проверка диапазонов для всех объектов
    if (this.pechiVr.getRange(address)) range = this.pechiVr.getRange(address);
    if (this.sushilki.getRange(address)) range = this.sushilki.getRange(address);
    if (this.mpa.getRange(address)) range = this.mpa.getRange(address);
    if (this.mills.getRange(address)) range = this.mills.getRange(address);
    if (this.mill10b.getRange(address)) range = this.mill10b.getRange(address);
    if (this.reactor296.getRange(address)) range = this.reactor296.getRange(address);

    if (!range) range = { min: 0, max: 100, step: 10 };  // Дефолтные значения

    const key = `${deviceID}-${address}`;
    if (!this.currentValues[key]) {
      this.currentValues[key] = this.initializeValue(range.min, range.max);
    }

    const maxStep = range.step || 50;

    // Генерация случайного изменения
    const change = (Math.random() - 0.5) * Math.min(maxStep, range.max - range.min);
    let newValue = this.currentValues[key] + change;

    // Проверка на выход за пределы диапазона
    if (newValue > range.max) newValue = range.max;
    if (newValue < range.min) newValue = range.min;

    this.currentValues[key] = newValue;
    return parseInt(newValue.toFixed(0));  // Возвращаем целочисленное значение
  }

  // Метод для инициализации значений
  initializeValue(min, max) {
    return min + Math.random() * (max - min);  // Инициализация случайным значением в пределах диапазона
  }
}
