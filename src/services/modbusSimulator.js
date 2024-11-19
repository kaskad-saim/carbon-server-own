export class ModbusSimulator {
  constructor(port) {
    this.port = port;
    this.isConnected = true;
    this.currentValues = {}; // Сохраняем текущие значения для каждого параметра
  }

  async connect() {
    console.log(`Симулятор Modbus подключен к порту ${this.port}`);
    return Promise.resolve();
  }

  // Списки адресов для каждого типа параметров, включая параметры для сушилок, мельниц и реактора К296
  temperatureAddressesList = [
    0x0000, 0x0002, 0x0004, 0x0006, // Температуры реактора К296
    0x0002, 0x0004, 0x0006, 0x0000, 0x0012, 0x0008, // общие
    0x000A, 0x000C, 0x004E, 0x000E, 0x0010, 0x004C, // общие
    0x0014, 0x0016, // общие
    0x0000, 0x0002, 0x0006 // Температура в топке, в камере смешения, уходящих газов для сушилки
  ];

  pressureAddressesList = [
    0x0026, 0x0028 // Давления для общих параметров
  ];

  vacuumAddressesList = [
    0x0020, 0x0024, 0x0022, // общие
    0x000A, 0x000C, 0x000E  // Разрежение в топке, камере выгрузки и воздуха на разбавление для сушилки
  ];

  levelAddressesList = [
    0x0008, 0x000A, 0x000C, 0x000E, // Уровни реактора К296
    0x002A, 0x003E, 0x0018 // Уровни для общих параметров
  ];

  imAddressesList = [
    0x0044, 0x0046, 0x0048, 0x004A, 0x001C, // общие
    0x001E, 0x0020 // Индикация паротушения и сбрасыватель для сушилки
  ];

  gorelkaAddressesList = [
    0x0010, 0x0012, 0x0014 // Мощность горелки, сигнал от регулятора и задание температуры для сушилки
  ];

  // Адреса для мельниц
  millAddressesList = [
    0x0000, 0x0001, 0x0002 // Фронтальное, Поперечное, Осевое для Мельницы 1 и 2
  ];

  async readFloat(deviceID, address, deviceLabel = '') {
    // Определяем диапазоны и начальные значения для каждого параметра
    const range = this.getRangeForParameter(deviceLabel, address);

    // Проверяем тип параметра по адресу и применяем соответствующий метод генерации значений
    const isTemperature = this.temperatureAddressesList.includes(address);
    const isLevel = this.levelAddressesList.includes(address);
    const isImpulseSignal = this.imAddressesList.includes(address);

    if (isTemperature || isLevel) {
      // Плавное изменение для температурных параметров и уровней
      if (!this.currentValues[address]) {
        this.currentValues[address] = this.initializeValue(range.min, range.max);
      }
      const maxStep = range.step || 50; // шаг изменения
      const change = (Math.random() - 0.5) * maxStep;
      let newValue = this.currentValues[address] + change;

      // Ограничиваем значение в заданном диапазоне
      if (newValue > range.max) newValue = range.max;
      if (newValue < range.min) newValue = range.min;

      this.currentValues[address] = newValue;
      return parseFloat(newValue.toFixed(2));
    } else if (isImpulseSignal) {
      // Логика для импульсных сигналов (boolean)
      return Math.random() > 0.5 ? 1 : 0;
    } else {
      // Рандомное значение для всех остальных параметров
      const randomValue = this.initializeValue(range.min, range.max);
      return parseFloat(randomValue.toFixed(2));
    }
  }

  async readInt16(deviceID, address, deviceLabel = '') {
    const key = `${deviceID}-${address}`;
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

  async readInt32(deviceID, address, deviceLabel = '') {
    // Для простоты используем ту же логику, что и для readInt16
    return await this.readInt16(deviceID, address, deviceLabel);
  }

  // Устанавливаем начальное значение в пределах min и max
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
}