import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './services/databaseService.js';
import { connectModbus } from './services/modbusService.js';
import { startDataRetrieval } from './services/carbonModbusService.js';
import vr1Routes from './routes/vr1Routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Настройка статической папки для обслуживания CSS, JS и других статических файлов
app.use(express.static(path.join(__dirname, '../public')));

// Маршруты для страниц
app.get('/mnemo-pech-vr-1', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'mnemo-pech-vr-1.html'));
});

app.get('/mnemo-pech-vr-2', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/production/carbon/pechiVr', 'mnemo-pech-vr-2.html'));
});

// Подключаемся к базе данных
connectDB();

// Подключаемся к Modbus и запускаем опрос данных
connectModbus()
  .then(() => {
    startDataRetrieval();
  })
  .catch((err) => {
    console.error('Ошибка при запуске опроса данных:', err);
  });

// Используем роут для VR1
app.use('/api', vr1Routes);

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
