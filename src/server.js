// server.js
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './services/databaseService.js';
import { connectModbus } from './services/modbusService.js';
import { startDataRetrieval } from './services/carbonModbusService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.static('public'));

// Подключаемся к базе данных
connectDB();

// Подключаемся к Modbus и запускаем опрос данных
connectModbus().then(() => {
  startDataRetrieval();
}).catch(err => {
  console.error('Ошибка при запуске опроса данных:', err);
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
