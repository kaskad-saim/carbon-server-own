import { readDataVr1 } from './pechVr1ModbusService.js';
import { readDataVr2 } from './pechVr2ModbusService.js';
import { readDataSushilka1 } from './sushilka1ModbusService.js';
// import { readDataSushilka2 } from './sushilka2ModbusService.js';

export const readDataSequentially = async () => {
  try {
    await readDataVr1();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await readDataVr2();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await readDataSushilka1();
  } catch (err) {
    console.error('Ошибка при чтении данных:', err);
  }
};

export const startDataRetrieval = () => {
  readDataSequentially();
  setInterval(readDataSequentially, 10000);
};
