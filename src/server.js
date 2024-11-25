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
import mill1Routes from './routes/mill1Routes.js';
import mill2Routes from './routes/mill2Routes.js';
import mill10bRoutes from './routes/mill10bRoutes.js';
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
const connectionAttempts = {}; // Отслеживание количества попыток подключения

// Функция для переподключения клиента
const reconnectModbusClient = async (client, port) => {
  if (connectionAttempts[port] >= 5) {
    logger.error(`Превышено максимальное количество попыток переподключения к порту ${port}.`);
    return;
  }

  try {
    logger.info(`Попытка переподключения к порту ${port}...`);
    connectionAttempts[port] = (connectionAttempts[port] || 0) + 1;

    // Проверяем, поддерживается ли метод disconnect
    if (typeof client.disconnect === 'function') {
      await client.disconnect(); // Очистить предыдущее соединение, если возможно
    } else {
      logger.warn(`Метод disconnect не поддерживается клиентом для порта ${port}`);
    }

    await client.connect();
    logger.info(`Успешное переподключение к порту ${port}`);
    connectionAttempts[port] = 0; // Сброс счетчика после успешного подключения
  } catch (err) {
    logger.error(`Ошибка при переподключении к порту ${port}:`, err);
    setTimeout(() => reconnectModbusClient(client, port), 5000); // Повторить попытку через 5 секунд
  }
};


// Инициализация клиентов
devicesConfig.forEach((device) => {
  if (!modbusClients[device.port]) {
    const { port, baudRate, timeout, retryInterval, maxRetries } = device;
    modbusClients[port] = new Client(port, baudRate, timeout, retryInterval, maxRetries);

    modbusClients[port]
      .connect()
      .then(() => logger.info(`Успешное подключение к порту ${port}`))
      .catch((err) => {
        logger.error(`Ошибка при начальном подключении к порту ${port}:`, err);
        reconnectModbusClient(modbusClients[port], port);
      });

    // Добавляем мониторинг состояния
    setInterval(async () => {
      if (!modbusClients[port].isConnected) {
        logger.warn(`Соединение с портом ${port} отсутствует. Попытка переподключения...`);
        await reconnectModbusClient(modbusClients[port], port);
      }
    }, 10000); // Проверка каждые 10 секунд
  }
});

// Добавляем список нестабильных портов
const unstablePorts = ['COM7'];

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
      logger.error(`Ошибка при выполнении операции из очереди ${port}:`, err);
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

// Обновленная функция для опроса данных
const startDataRetrieval = async () => {
  const ports = ['COM8', 'COM3', 'COM10', 'COM13', 'COM7', 'COM1'];

  for (const port of ports) {
    const devices = devicesConfig.filter((device) => device.port === port);
    const client = modbusClients[port];

    const readDevices = async () => {
      for (const device of devices) {
        const module = await import(device.serviceModule);
        const readDataFunction = module[device.readDataFunction];
        const { deviceID, name: deviceLabel } = device;

        try {
          if (unstablePorts.includes(port)) {
            addToQueueWithTimeout(port, async () => {
              if (!client.isConnected) await reconnectModbusClient(client, port);
              await readDataFunction(client, deviceID, deviceLabel);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            });
          } else {
            if (!client.isConnected) await reconnectModbusClient(client, port);
            await readDataFunction(client, deviceID, deviceLabel);
            await new Promise((resolve) => setTimeout(resolve, 500));
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


// Запускаем опрос данных
startDataRetrieval();

// Используем маршруты
app.use('/api', vr1Routes);
app.use('/api', vr2Routes);
app.use('/api', sushilka1Routes);
app.use('/api', sushilka2Routes);
app.use('/api', mill1Routes);
app.use('/api', mill2Routes);
app.use('/api', mill10bRoutes);
app.use('/api', reactorRoutes);
app.use('/api/lab', laboratoryRoutes);

app.get('/api/server-time', (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// Маршруты для получения данных VR1 и VR2
app.get('/api/vr1/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechVr1Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных VR1:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

app.get('/api/vr2/data', async (req, res) => {
  try {
    const { start, end } = req.query;
    const query = start && end ? { lastUpdated: { $gte: new Date(start), $lte: new Date(end) } } : {};
    const data = await PechVr2Model.find(query).sort({ lastUpdated: 1 });
    res.json(data);
  } catch (error) {
    logger.error('Ошибка при получении данных VR2:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
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
