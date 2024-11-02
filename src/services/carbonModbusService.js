import { readDataVr1 } from './pechVr1ModbusService.js';
import { readDataVr2 } from './pechVr2ModbusService.js';

// Функция с добавленной задержкой между опросами VR1 и VR2
export const readDataSequentially = async () => {
  try {
    await readDataVr1();
    // await new Promise((resolve) => setTimeout(resolve, 100)); // Задержка в 100 мс
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
