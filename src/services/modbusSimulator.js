export class ModbusSimulator {
  constructor(port) {
    this.port = port;
    this.isConnected = true;
    this.currentValues = {}; // Хранит текущие значения для каждого параметра

    // Карта устройств для быстрого доступа по deviceLabel
    this.devices = {
      // Существующие устройства
      pechiVr: this.pechiVr,
      sushilki: this.sushilki,
      mpa: this.mpa,
      mills: this.mills,
      mill10b: this.mill10b,
      reactor296: this.reactor296,
      press296: this.press296,

      // Новые устройства
      DE093: this.DE093,
      DD972: this.DD972,
      DD973: this.DD973,
      DD576: this.DD576,
      DD569: this.DD569,
      DD923: this.DD923,
      DD924: this.DD924,
    };
  }

  async connect() {
    console.log(`Симулятор Modbus подключен к порту ${this.port}`);
    return Promise.resolve();
  }

  // Существующие объекты для каждого типа оборудования
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

  // Новые объекты для дополнительных устройств

  // DE093
  DE093 = {
    addressesList: {
      'Гкал/ч DE093': 0x0004,
      'Температура DE093': 0x0006,
      'Давление DE093': 0x0008,
      'Куб/ч DE093': 0x000a,
      'Тонн/ч DE093': 0x000c,
      'Накопленно тонн DE093': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD972
  DD972 = {
    addressesList: {
      'Гкал/ч DD972': 0x0004,
      'Температура DD972': 0x0006,
      'Давление DD972': 0x0008,
      'Куб/ч DD972': 0x000a,
      'Тонн/ч DD972': 0x000c,
      'Накопленно тонн DD972': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD973
  DD973 = {
    addressesList: {
      'Гкал/ч DD973': 0x0004,
      'Температура DD973': 0x0006,
      'Давление DD973': 0x0008,
      'Куб/ч DD973': 0x000a,
      'Тонн/ч DD973': 0x000c,
      'Накопленно тонн DD973': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD576
  DD576 = {
    addressesList: {
      'Гкал/ч DD576': 0x0004,
      'Температура DD576': 0x0006,
      'Давление DD576': 0x0008,
      'Куб/ч DD576': 0x000a,
      'Тонн/ч DD576': 0x000c,
      'Накопленно тонн DD576': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD569
  DD569 = {
    addressesList: {
      'Гкал/ч DD569': 0x0004,
      'Температура DD569': 0x0006,
      'Давление DD569': 0x0008,
      'Куб/ч DD569': 0x000a,
      'Тонн/ч DD569': 0x000c,
      'Накопленно тонн DD569': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD923
  DD923 = {
    addressesList: {
      'Гкал/ч DD923': 0x0004,
      'Температура DD923': 0x0006,
      'Давление DD923': 0x0008,
      'Куб/ч DD923': 0x000a,
      'Тонн/ч DD923': 0x000c,
      'Накопленно тонн DD923': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }
  };

  // DD924
  DD924 = {
    addressesList: {
      'Гкал/ч DD924': 0x0004,
      'Температура DD924': 0x0006,
      'Давление DD924': 0x0008,
      'Куб/ч DD924': 0x000a,
      'Тонн/ч DD924': 0x000c,
      'Накопленно тонн DD924': 0x000e,
    },
    getRange(address) {
      switch (address) {
        case 0x0004: // Гкал/ч
          return { min: 0, max: 10, step: 0.1 };
        case 0x0006: // Температура
          return { min: 0, max: 200, step: 1 };
        case 0x0008: // Давление
          return { min: 0, max: 5, step: 0.1 };
        case 0x000a: // Куб/ч
          return { min: 0, max: 1000, step: 10 };
        case 0x000c: // Тонн/ч
          return { min: 0, max: 2, step: 0.1 };
        case 0x000e: // Накопленно тонн
          return { min: 0, max: 100, step: 1 };
        default:
          return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
      }
    }

  };


  press296 = {
    termodatAddressesList: [
      0x0002, 0x0004
    ],
    controllerAddressesList: [
      0x4804, 0x4138,
    ],
    getRange(address) {
      if (this.termodatAddressesList.includes(address)) return { min: 0, max: 100, step: 10 };
      if (this.controllerAddressesList.includes(address)) return { min: 0, max: 2500, step: 50 };
      return { min: 0, max: 100, step: 10 }; // Значения по умолчанию
    }
  };

  // Метод для чтения значений с учётом объекта и диапазона
  async readFloat(deviceID, address, deviceLabel = '') {
    let range = null;

    // Проверка диапазонов для всех объектов
    const device = this.devices[deviceLabel];
    if (device && device.getRange) {
      range = device.getRange(address, deviceLabel);
    }

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

    // Логирование изменений (можно раскомментировать при необходимости)
    // console.log(`Старое значение: ${this.currentValues[key]}, Изменение: ${change}, Новое значение: ${newValue}`);

    this.currentValues[key] = newValue;
    return parseFloat(newValue.toFixed(2));  // Возвращаем значение с двумя знаками после запятой
  }

  // Метод для чтения int16 значений
  async readInt16(deviceID, address, deviceLabel = '') {
    let range = null;

    // Проверка диапазонов для всех объектов
    const device = this.devices[deviceLabel];
    if (device && device.getRange) {
      range = device.getRange(address);
    }

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

  // Метод для чтения float LE (Little Endian)
  async readFloatLE(deviceID, address, deviceLabel = '') {
    // Симуляция чтения float LE аналогично readFloat
    // В реальном случае может потребоваться другая логика
    return await this.readFloat(deviceID, address, deviceLabel);
  }

  // Метод для чтения float BE (Big Endian)
  async readFloatBE(deviceID, address, deviceLabel = '') {
    // Симуляция чтения float BE аналогично readFloat
    // В реальном случае может потребоваться другая логика
    return await this.readFloat(deviceID, address, deviceLabel);
  }

  // Метод для чтения int32 значений
  async readInt32(deviceID, address, deviceLabel = '') {
    // Для симуляции int32 можно использовать два int16 и объединить их
    const high = await this.readInt16(deviceID, address, deviceLabel);
    const low = await this.readInt16(deviceID, address + 1, deviceLabel);
    return high * 65536 + low;
  }


  async readCoil(deviceID, address, label = '') {
    const key = `${deviceID}-coil-${address}`;
    if (!(key in this.currentValues)) {
      this.currentValues[key] = false;
    }
    if (Math.random() < 0.1) {
      this.currentValues[key] = !this.currentValues[key];
    }
    return this.currentValues[key];
  }

  // Метод для инициализации значений
  initializeValue(min, max) {
    return min + Math.random() * (max - min);  // Инициализация случайным значением в пределах диапазона
  }
}
