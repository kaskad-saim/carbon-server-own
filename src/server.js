// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import logger from './logger.js';
import { fileURLToPath } from 'url';
import { ModbusClient } from './services/modbusClient.js';
import { ModbusSimulator } from './services/modbusSimulator.js';
import pageRoutes from './routes/pageRoutes.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';
import sushilka1Routes from './routes/sushilka1Routes.js';
import sushilka2Routes from './routes/sushilka2Routes.js';
import mpa2Routes from './routes/mpa2Routes.js';
import mpa3Routes from './routes/mpa3Routes.js';
import mill1Routes from './routes/mill1Routes.js';
import mill2Routes from './routes/mill2Routes.js';
import mill10bRoutes from './routes/mill10bRoutes.js';
import reactorRoutes from './routes/reactor296Routes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js';
import graphicRoutes from './routes/graphicRoutes.js';
import { connectDB } from './services/dataBaseService.js';
import { devicesConfig } from './services/devicesConfig.js';
import uzliUchetaService from './routes/uzliUchetaRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import notis1Routes from './routes/notis1Routes.js';
import notis2Routes from './routes/notis2Routes.js';
import { readDataNotis1, readDataNotis2 } from './services/notisService.js';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config();
const port = process.env.PORT || 3002;

// Определяем, использовать ли симулятор или реальный ModbusClient
const isProduction = process.env.NODE_ENV === 'production';
const Client = isProduction ? ModbusClient : ModbusSimulator;
logger.info(`Используется ${isProduction ? 'ModbusClient' : 'ModbusSimulator'}`);

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

// Объекты для хранения очередей запросов и флагов состояния для каждого порта
const requestQueues = {};
const isProcessing = {};

// Функция для добавления в очередь с таймаутом
const addToQueueWithTimeout = (port, fn, timeout = 10000) => {
  if (!requestQueues[port]) {
    requestQueues[port] = [];
  }
  requestQueues[port].push({ fn, timeout });
  processQueue(port);
};

// Функция для обработки очереди
const processQueue = async (port) => {
  if (isProcessing[port]) return;
  isProcessing[port] = true;

  while (requestQueues[port] && requestQueues[port].length) {
    const { fn, timeout } = requestQueues[port].shift();
    try {
      await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Queue operation timed out')), timeout)
        ),
      ]);
    } catch (err) {
      logger.error(`Ошибка при выполнении операции из очереди на порту ${port}:`, err);
      if (err.message === 'Queue operation timed out') {
        await modbusClients[port].disconnect();
        await modbusClients[port].connect();
      }
    }
    // Добавляем задержку между операциями
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка в 2 секунды
  }

  isProcessing[port] = false;
};

// Инициализация клиентов
devicesConfig.forEach((device) => {
  const {
    port,
    baudRate,
    timeout,
    retryInterval,
    maxRetries,
    unstable,
  } = device;

  if (!modbusClients[port]) {
    modbusClients[port] = new Client(
      port,
      baudRate,
      timeout,
      retryInterval,
      maxRetries,
      unstable
    );

    modbusClients[port]
      .connect()
      .then(() => logger.info(`Успешное подключение к порту ${port}`))
      .catch((err) => {
        logger.error(`Ошибка при начальном подключении к порту ${port}:`, err);
        // Здесь можно вызвать функцию переподключения, если необходимо
      });
  }
});

// Инициализация Serial Port клиентов
const serialPortClients = {}; // Карта для serial port клиентов

if (isProduction) {
  // В продакшен режиме инициализируем реальные последовательные порты
  initSerialPorts();
} else {
  // В режиме разработки используем симулятор SerialPort
  serialDevicesConfig.forEach((device) => {
    const { port } = device;

    if (!serialPortClients[port]) {
      // Симулятор SerialPort
      const simulator = new SerialPortSimulator(port);
      serialPortClients[port] = simulator;

      simulator.connect()
        .then(() => {
          logger.info(`Симулятор SerialPort подключен к порту ${port}`);
        })
        .catch((err) => {
          logger.error(`Ошибка подключения симулятора SerialPort ${port}:`, err);
        });

    }
  });
}

// Функция для опроса данных Modbus
const startDataRetrieval = async () => {
  // Получаем уникальные порты из конфигурации устройств
  const ports = [...new Set(devicesConfig.map((device) => device.port))];

  for (const port of ports) {
    const devices = devicesConfig.filter((device) => device.port === port);
    const client = modbusClients[port];
    const unstable = devices.some((device) => device.unstable);

    const readDevices = async () => {
      for (const device of devices) {
        const module = await import(device.serviceModule);
        const readDataFunction = module[device.readDataFunction];
        const { deviceID, name: deviceLabel } = device;

        try {
          if (unstable) {
            // Обработка нестабильных портов с использованием очереди
            addToQueueWithTimeout(port, async () => {
              if (!client.isConnected) await client.safeReconnect();
              await readDataFunction(client, deviceID, deviceLabel);
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка между запросами
            });
          } else {
            // Обработка стабильных портов
            if (!client.isConnected) await client.safeReconnect();
            await readDataFunction(client, deviceID, deviceLabel);
            await new Promise((resolve) => setTimeout(resolve, 500)); // Задержка между запросами
          }
        } catch (err) {
          logger.error(`Ошибка при опросе данных ${deviceLabel} на порту ${port}:`, err);
        }
      }
    };

    // Периодический запуск опроса данных
    readDevices();
    setInterval(readDevices, 10000);
  }
};

const startNotisDataRetrieval = () => {
  setInterval(async () => {
    await readDataNotis1();
    await readDataNotis2();
  }, 10000); // Опрос каждые 10 секунд
};

startNotisDataRetrieval();

// Запускаем опрос данных Modbus
startDataRetrieval();

// Используем маршруты
app.use('/api', vr1Routes);
app.use('/api', vr2Routes);
app.use('/api', sushilka1Routes);
app.use('/api', sushilka2Routes);
app.use('/api', mpa2Routes);
app.use('/api', mpa3Routes);
app.use('/api', uzliUchetaService);
app.use('/api', mill1Routes);
app.use('/api', mill2Routes);
app.use('/api', mill10bRoutes);
app.use('/api', reactorRoutes);
app.use('/api/lab', laboratoryRoutes);
app.use('/api', graphicRoutes); //api получасовых графиков
app.use('/api', notis1Routes);
app.use('/api', notis2Routes);

// Добавляем новый маршрут для отчетов
app.use('/api/reports', reportRoutes);

app.get('/api/server-time', (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// Режим разработки
app.get('/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.NODE_ENV = "${process.env.NODE_ENV}";`);
});

// Запуск сервера
app.listen(port, () => {
  logger.info(`Сервер запущен на http://localhost:${port}`);
});