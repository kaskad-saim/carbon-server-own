// app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ModbusClient } from './services/modbusClient.js';
import pageRoutes from './routes/pageRoutes.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';
import sushilka1Routes from './routes/sushilka1Routes.js';
import sushilka2Routes from './routes/sushilka2Routes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import { connectDB } from './services/dataBaseService.js';
import { devicesConfig } from './services/devicesConfig.js';
import { PechVr1Model, PechVr2Model } from './models/pechVrModel.js';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Настройка Middleware
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
    modbusClients[device.port] = new ModbusClient(device.port);
    // Инициализируем соединение при старте
    modbusClients[device.port].connect().catch(err => {
      console.error(`Ошибка при начальном подключении к порту ${device.port}:`, err);
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
        // Задержка между запросами к устройствам на COM8 (например, 500 мс)
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error(`Ошибка при опросе данных ${deviceLabel}:`, err);
      }
    }
  };

  // Запускаем опрос данных на COM8 каждые 10 секунд
  readDevicesOnCOM8();
  setInterval(readDevicesOnCOM8, 10000);

  // Устройство на COM3 (Sushilka2)
  const deviceSushilka2 = devicesConfig.find(device => device.name === 'Sushilka2');
  const modbusClientCOM3 = modbusClients['COM3'];
  const moduleSushilka2 = await import(deviceSushilka2.serviceModule);
  const readDataFunctionSushilka2 = moduleSushilka2[deviceSushilka2.readDataFunction];
  const { deviceID: deviceIDSushilka2, name: deviceLabelSushilka2 } = deviceSushilka2;

  // Запускаем опрос данных для Sushilka2 каждые 10 секунд
  setInterval(async () => {
    try {
      await readDataFunctionSushilka2(modbusClientCOM3, deviceIDSushilka2, deviceLabelSushilka2);
    } catch (err) {
      console.error(`Ошибка при опросе данных ${deviceLabelSushilka2}:`, err);
    }
  }, 10000);
};

// Запускаем опрос данных
startDataRetrieval();

// Используем маршруты
app.use('/api', vr1Routes);
app.use('/api', vr2Routes);
app.use('/api', sushilka1Routes);
app.use('/api', sushilka2Routes);
app.use('/api/lab', laboratoryRoutes);

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

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
