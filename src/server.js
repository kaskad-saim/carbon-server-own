import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ModbusClient } from './services/modbusClient.js';
import { ModbusSimulator } from './services/modbusSimulator.js';
import pageRoutes from './routes/pageRoutes.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';
import sushilka1Routes from './routes/sushilka1Routes.js';
import sushilka2Routes from './routes/sushilka2Routes.js';
import mill1Routes from './routes/mill1Routes.js';
import mill2Routes from './routes/mill2Routes.js';
import reactorRoutes from './routes/reactor296Routes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import { connectDB } from './services/dataBaseService.js';
import { devicesConfig } from './services/devicesConfig.js';
import { PechVr1Model, PechVr2Model } from './models/pechVrModel.js';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config();
const port = process.env.PORT || 3002;

// Определяем, использовать ли симулятор или реальный ModbusClient
const isProduction = process.env.NODE_ENV === 'production';
const Client = isProduction ? ModbusClient : ModbusSimulator;
console.log(`Используется ${isProduction ? 'ModbusClient' : 'ModbusSimulator'}`);

// Создаем приложение Express
const app = express();

// Подключаем middleware
app.use(cors());
app.use(express.json());

// Настройка статической папки
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты для страниц
app.use('/', pageRoutes);

// Подключение к базе данных
connectDB();

// Создаем карту Modbus-клиентов для каждого COM-порта
const modbusClients = {};

devicesConfig.forEach((device) => {
  if (!modbusClients[device.port]) {
    const { port, baudRate, timeout, retryInterval, maxRetries } = device;
    modbusClients[port] = new Client(port, baudRate, timeout, retryInterval, maxRetries); // Передаем параметры
    modbusClients[port].connect().catch(err => {
      console.error(`Ошибка при начальном подключении к порту ${port}:`, err);
    });
  }
});


// Функция для запуска опроса данных
const startDataRetrieval = async () => {
  // Устройства на COM8
  const devicesOnCOM8 = devicesConfig.filter(device => device.port === 'COM8');
  const modbusClientCOM8 = modbusClients['COM8'];

  const readDevicesOnCOM8 = async () => {
    for (const device of devicesOnCOM8) {
      const module = await import(device.serviceModule);
      const readDataFunction = module[device.readDataFunction];
      const { deviceID, name: deviceLabel } = device;

      try {
        await readDataFunction(modbusClientCOM8, deviceID, deviceLabel);
        // Задержка между запросами к устройствам на COM8
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };

  // Запускаем опрос данных на COM8 каждые 10 секунд
  readDevicesOnCOM8();
  setInterval(readDevicesOnCOM8, 10000);

  // Устройства на COM3 (Сушилка2)
  const devicesOnCOM3 = devicesConfig.filter(device => device.port === 'COM3');
  const modbusClientCOM3 = modbusClients['COM3'];

  const readDevicesOnCOM3 = async () => {
    for (const device of devicesOnCOM3) {
      const module = await import(device.serviceModule);
      const readDataFunction = module[device.readDataFunction];
      const { deviceID, name: deviceLabel } = device;

      try {
        await readDataFunction(modbusClientCOM3, deviceID, deviceLabel);
        // Задержка между запросами к устройствам на COM3
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };

  // Запускаем опрос данных на COM3 каждые 10 секунд
  readDevicesOnCOM3();
  setInterval(readDevicesOnCOM3, 10000);

  // Устройства на COM10 (Сушилка1)
  const devicesOnCOM10 = devicesConfig.filter(device => device.port === 'COM10');
  const modbusClientCOM10 = modbusClients['COM10'];

  const readDevicesOnCOM10 = async () => {
    for (const device of devicesOnCOM10) {
      const module = await import(device.serviceModule);
      const readDataFunction = module[device.readDataFunction];
      const { deviceID, name: deviceLabel } = device;

      try {
        await readDataFunction(modbusClientCOM10, deviceID, deviceLabel);
        // Задержка между запросами к устройствам на COM10
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };

  // Запускаем опрос данных на COM10 каждые 10 секунд
  readDevicesOnCOM10();
  setInterval(readDevicesOnCOM10, 10000);
  // Устройства на COM13
  const devicesOnCOM13 = devicesConfig.filter(device => device.port === 'COM13');
  const modbusClientCOM13 = modbusClients['COM13'];
  const readDevicesOnCOM13 = async () => {
    for (const device of devicesOnCOM13) {
      const module = await import(device.serviceModule);
      const readDataFunction = module[device.readDataFunction];
      const { deviceID, name: deviceLabel } = device;
      try {
        await readDataFunction(modbusClientCOM13, deviceID, deviceLabel);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };
  readDevicesOnCOM13();
  setInterval(readDevicesOnCOM13, 10000);

  // Устройства на COM7 (Мельница 2 и Реактор К296)
  const devicesOnCOM7 = devicesConfig.filter(device => device.port === 'COM7');
  const modbusClientCOM7 = modbusClients['COM7'];
  const readDevicesOnCOM7 = async () => {
    for (const device of devicesOnCOM7) {
      const module = await import(device.serviceModule);
      const readDataFunction = module[device.readDataFunction];
      const { deviceID, name: deviceLabel } = device;
      try {
        await readDataFunction(modbusClientCOM7, deviceID, deviceLabel);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };
  readDevicesOnCOM7();
  setInterval(readDevicesOnCOM7, 10000);
};

// Запускаем опрос данных
startDataRetrieval();

// Используем маршруты
app.use('/api', vr1Routes);
app.use('/api', vr2Routes);
app.use('/api', sushilka1Routes);
app.use('/api', sushilka2Routes);
app.use('/api', mill1Routes);
app.use('/api', mill2Routes);
app.use('/api', reactorRoutes);
app.use('/api/lab', laboratoryRoutes);

app.get('/api/server-time', (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// Маршрут для получения данных VR1
app.get('/api/vr1/data', async (req, res) => {
  try {
    const { start, end } = req.query;

    // Формируем условия поиска
    const query = {};
    if (start && end) {
      query.lastUpdated = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const data = await PechVr1Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных VR1:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Маршрут для получения данных VR2
app.get('/api/vr2/data', async (req, res) => {
  try {
    const { start, end } = req.query;

    // Формируем условия поиска
    const query = {};
    if (start && end) {
      query.lastUpdated = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const data = await PechVr2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    console.error('Ошибка при получении данных VR2:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// определение режима разработки и отправка его на клиент
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.NODE_ENV = "${process.env.NODE_ENV}";`);
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
