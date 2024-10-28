// services/pechModbusService.js
import { readDataVr1 } from './pechVr1ModbusService.js';
import { readDataVr2 } from './pechVr2ModbusService.js';

export const readDataSequentially = async () => {
  try {
    await readDataVr1();
    await readDataVr2();
  } catch (err) {
    console.error('Ошибка при чтении данных:', err);
  }
};

// Запускаем функцию каждые 10 секунд
export const startDataRetrieval = () => {
  // Вызываем сразу при старте
  readDataSequentially();

  // Затем запускаем интервал
  setInterval(readDataSequentially, 10000);
};
