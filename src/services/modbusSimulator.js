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

  // Списки адресов для различных типов параметров

  // Адреса температур
  temperatureAddressesList = [
    // Существующие адреса температур
    0x0000, 0x0002, 0x0004, 0x0006, // Температуры реактора К296
    0x0002, 0x0004, 0x0006, 0x0000, 0x0012, 0x0008, // Общие
    0x000A, 0x000C, 0x004E, 0x000E, 0x0010, 0x004C, // Общие
    0x0014, 0x0016, // Общие
    0x0000, 0x0002, 0x0006, // Температуры для сушилок
    // Адреса температур для МПА2 и МПА3
    0x0000, 0x0001, 0x0002, 0x0003, 0x0004, 0x0005,
    0x0006, 0x0007, 0x0008, 0x0009, 0x000A, 0x000B,
    0x000C, 0x000D, 0x000E, 0x000F,
  ];

  // Адреса давления
  pressureAddressesList = [
    // Существующие адреса давлений
    0x0026, 0x0028,
    // Адреса давлений для МПА2 и МПА3
    0x0010, 0x0011, 0x0012,
    // Дополнительные давления с устройств ID 8 и 9
    0x0000, 0x0001, 0x0002, 0x0003,
    0x0004, 0x0005, 0x0006, 0x0007,
  ];

  // Адреса разрежения
  vacuumAddressesList = [
    0x0020, 0x0024, 0x0022, // Общие
    0x000A, 0x000C, 0x000E, // Разрежение для сушилок
  ];

  // Адреса уровней
  levelAddressesList = [
    0x0008, 0x000A, 0x000C, 0x000E, // Уровни реактора К296
    0x002A, 0x003E, 0x0018, // Уровни для общих параметров
  ];

  // Адреса импульсных сигналов
  imAddressesList = [
    0x0044, 0x0046, 0x0048, 0x004A, 0x001C, // Общие
    0x001E, 0x0020, // Сигналы для сушилок
  ];

  // Адреса горелок
  gorelkaAddressesList = [
    0x0010, 0x0012, 0x0014, // Параметры горелки для сушилок
  ];

  // Адреса для мельниц, включая mill10b
  millAddressesList = [
    0x0000, 0x0001, 0x0002, // Адреса для mill1 и mill2
    0x0000, 0x0001, 0x0002, // Адреса для mill10b (совпадают с предыдущими)
    0x0003, 0x0004, 0x0005, // Дополнительные адресы для mill10b
    0x0006, 0x0007, 0x0008, // Дополнительные адресы для mill10b
  ];

  // Метод для чтения float значений
  async readFloat(deviceID, address, deviceLabel = '') {
    // Определяем диапазоны и начальные значения для каждого параметра
    const range = this.getRangeForParameter(deviceLabel, address);

    // Проверяем тип параметра по адресу и применяем соответствующий метод генерации значений
    const isTemperature = this.temperatureAddressesList.includes(address);
    const isLevel = this.levelAddressesList.includes(address);
    const isImpulseSignal = this.imAddressesList.includes(address);

    const key = `${deviceID}-${address}`;

    if (isTemperature || isLevel) {
      // Плавное изменение для температур и уровней
      if (!this.currentValues[key]) {
        this.currentValues[key] = this.initializeValue(range.min, range.max);
      }
      const maxStep = range.step || 50; // Шаг изменения
      const change = (Math.random() - 0.5) * maxStep;
      let newValue = this.currentValues[key] + change;

      // Ограничиваем значение в заданном диапазоне
      if (newValue > range.max) newValue = range.max;
      if (newValue < range.min) newValue = range.min;

      this.currentValues[key] = newValue;
      return parseFloat(newValue.toFixed(2));
    } else if (isImpulseSignal) {
      // Логика для импульсных сигналов (boolean)
      return Math.random() > 0.5 ? 1 : 0;
    } else {
      // Рандомное значение для остальных параметров
      const randomValue = this.initializeValue(range.min, range.max);
      return parseFloat(randomValue.toFixed(2));
    }
  }

  // Метод для чтения int16 значений
  async readInt16(deviceID, address, deviceLabel = '') {
    const key = `${deviceID}-${address}`;

    // Проверяем, является ли адрес температурой
    if (this.temperatureAddressesList.includes(address)) {
      // Симулируем температуру
      if (!this.currentValues[key]) {
        this.currentValues[key] = this.getRandomInt(0, 1100); // Значения от 0 до 1100
      } else {
        // Изменяем значение плавно
        const change = Math.floor((Math.random() - 0.5) * 20); // Шаг изменения
        let newValue = this.currentValues[key] + change;
        newValue = Math.max(0, Math.min(1100, newValue));
        this.currentValues[key] = newValue;
      }
      return this.currentValues[key];
    }

    // Проверяем, является ли адрес давлением
    if (
      this.pressureAddressesList.includes(address) ||
      ((deviceID === 8 || deviceID === 9) && address >= 0x0000 && address <= 0x0007)
    ) {
      // Симулируем давление
      if (!this.currentValues[key]) {
        this.currentValues[key] = this.getRandomInt(-100, 300); // Значения от -100 до 300
      } else {
        // Изменяем значение плавно
        const change = Math.floor((Math.random() - 0.5) * 20); // Шаг изменения
        let newValue = this.currentValues[key] + change;
        newValue = Math.max(-100, Math.min(300, newValue));
        this.currentValues[key] = newValue;
      }
      return this.currentValues[key];
    }

    // Обработка адресов мельниц
    const isMillAddress = this.millAddressesList.includes(address);
    if (isMillAddress) {
      if (!this.currentValues[key]) {
        this.currentValues[key] = Math.floor(Math.random() * 11); // Значения от 0 до 10
      } else {
        const change = Math.floor((Math.random() - 0.5) * 2);
        let newValue = this.currentValues[key] + change;
        newValue = Math.max(0, Math.min(10, newValue));
        this.currentValues[key] = newValue;
      }
      return this.currentValues[key];
    }

    // Значение по умолчанию
    return 0;
  }

  // Метод для чтения int32 значений (можно оставить как есть или настроить по аналогии)
  async readInt32(deviceID, address, deviceLabel = '') {
    // Для простоты используем ту же логику, что и для readInt16
    return await this.readInt16(deviceID, address, deviceLabel);
  }

  // Инициализация начального значения в пределах min и max
  initializeValue(min, max) {
    return Math.random() * (max - min) + min;
  }

  // Определяем диапазон и шаг изменения для каждого параметра на основе адреса или метки
  getRangeForParameter(label, address) {
    if (this.temperatureAddressesList.includes(address)) {
      if (address >= 0x0000 && address <= 0x0006) {
        // Температуры реактора К296
        return { min: 0, max: 100, step: 5 };
      }
      return { min: 0, max: 1100, step: 100 };
    }

    if (this.levelAddressesList.includes(address)) {
      if (address >= 0x0008 && address <= 0x000E) {
        // Уровни реактора К296
        return { min: 0, max: 2500, step: 50 };
      }
      // Другие уровни
      if (label === 'В ванне скруббера') return { min: 0, max: 1000, step: 50 };
      if (label === 'В емкости ХВО') return { min: 0, max: 6000, step: 100 };
      if (label === 'В барабане котла') return { min: -100, max: 100, step: 20 };
    }

    if (this.pressureAddressesList.includes(address)) return { min: -20, max: 30, step: 5 };
    if (this.vacuumAddressesList.includes(address)) return { min: -20, max: 30, step: 5 };

    if (this.gorelkaAddressesList.includes(address)) return { min: 0, max: 100, step: 10 };
    if (this.imAddressesList.includes(address)) return { min: 0, max: 1, step: 1 };

    // По умолчанию
    return { min: 0, max: 100, step: 10 };
  }

  // Метод для получения случайного целого числа в диапазоне
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
