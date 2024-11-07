import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectModbus } from './services/modbusService.js';
import { startDataRetrieval } from './services/carbonModbusService.js';
import pageRoutes from './routes/pageRoutes.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';
import sushilka1Routes from './routes/sushilka1Routes.js';
import sushilka2Routes from './routes/sushilka2Routes.js';
import laboratoryRoutes from './routes/laboratoryRoutes.js'; // Импорт маршрутов данных летучек
import { connectDB } from './services/dataBaseService.js'; // Основная БД
import { PechVr1Model } from './models/pechVrModel.js';
import { PechVr2Model } from './models/pechVrModel.js';
import { connectModbusSushilka2, readDataSushilka2 } from './services/sushilka2ModbusService.js';

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загружаем переменные окружения
dotenv.config();

const app = express();
const port = process.env.PORT;

// Настройка Middleware
app.use(cors());
app.use(express.json());

// Настройка статической папки для обслуживания CSS, JS и других статических файлов
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты для страниц
app.use('/', pageRoutes);

connectDB();

// Подключаемся к Modbus и запускаем опрос данных
connectModbus()
  .then(() => {
    startDataRetrieval();
  })
  .catch((err) => {
    console.error('Ошибка при запуске опроса данных:', err);
  });

connectModbusSushilka2()
  .then(() => {
    setInterval(readDataSushilka2, 10000); // Интервал опроса в миллисекундах
  })
  .catch((err) => {
    console.error('Ошибка при запуске опроса данных для Sushilka 2:', err);
  });

// Используем маршруты
app.use('/api', vr1Routes); // Для данных VR1 и VR2
app.use('/api', vr2Routes); // Для данных VR1 и VR2
app.use('/api', sushilka1Routes);
app.use('/api', sushilka2Routes);
app.use('/api/lab', laboratoryRoutes); // Для данных летучек

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
  console.log(`Сервер запущен на http://169.254.0.156:${port}`);
});
