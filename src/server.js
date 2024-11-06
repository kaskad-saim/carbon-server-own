import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectModbus } from './services/modbusService.js';
import { startDataRetrieval } from './services/carbonModbusService.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';
import sushilka1Routes from './routes/sushilka1Routes.js';


import laboratoryRoutes from './routes/laboratoryRoutes.js'; // Импорт маршрутов данных летучек
import { connectDB } from './services/dataBaseService.js'; // Основная БД

import { PechVr1Model } from './models/pechVrModel.js';
import { PechVr2Model } from './models/pechVrModel.js';

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
app.get('/mnemo-pech-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'mnemo-pech-vr-1.html'));
});

app.get('/current-pech-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'current-pech-vr-1.html'));
});

app.get('/mnemo-pech-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'mnemo-pech-vr-2.html'));
});

app.get('/current-pech-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'current-pech-vr-2.html'));
});

app.get('/web-vizual-vr', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/', 'web-vizual-vr.html'));
});

// Маршруты для страниц
app.get('/graph-vr-general-tempers', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vrGeneralTemper.html'));
});

app.get('/graph-vr-general-pressure', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vrGeneralPressure.html'));
});

app.get('/graph-vr-general-level', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vrGeneralLevel.html'));
});

app.get('/graphic-hour-temper-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-hour-temp.html'));
});

app.get('/graphic-hour-temper-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-hour-temp.html'));
});

app.get('/graphic-hour-davlenie-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-hour-davl.html'));
});

app.get('/graphic-hour-davlenie-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-hour-davl.html'));
});

app.get('/graphic-hour-level-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-hour-level.html'));
});

app.get('/graphic-hour-level-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-hour-level.html'));
});

app.get('/graphic-temper-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-temper.html'));
});

app.get('/graphic-temper-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-temper.html'));
});

app.get('/general-temper-vr', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'generalVr-temper.html'));
});

app.get('/graphic-temper-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-temper.html'));
});

app.get('/graphic-davlenie-vr', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr-davl.html'));
});

app.get('/graphic-davlenie-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-davl.html'));
});

app.get('/graphic-davlenie-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-davl.html'));
});

app.get('/graphic-level-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr1-level.html'));
});

app.get('/graphic-level-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr/graphics', 'vr2-level.html'));
});


app.get('/mnemo-sushilka1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/sushilki/', 'mnemo-sushilka1.html'));
});

app.get('/currentParam-sushilka1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/sushilki/', 'currentParam-sushilka1.html'));
});

connectDB();

// Подключаемся к Modbus и запускаем опрос данных
connectModbus()
  .then(() => {
    startDataRetrieval();
  })
  .catch((err) => {
    console.error('Ошибка при запуске опроса данных:', err);
  });

// Используем маршруты
app.use('/api', vr1Routes); // Для данных VR1 и VR2
app.use('/api', vr2Routes); // Для данных VR1 и VR2
app.use('/api', sushilka1Routes);
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
