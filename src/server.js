import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectModbus } from './services/modbusService.js';
import { startDataRetrieval } from './services/carbonModbusService.js';
import vr1Routes from './routes/vr1Routes.js';
import vr2Routes from './routes/vr2Routes.js';

import laboratoryRoutes from './routes/laboratoryRoutes.js'; // Импорт маршрутов данных летучек
import { connectDB } from './services/dataBaseService.js'; // Основная БД

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
app.use('/api/lab', laboratoryRoutes); // Для данных летучек

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
