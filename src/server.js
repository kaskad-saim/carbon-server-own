import express from 'express';
import dotenv from 'dotenv';
import { readDataVr1 } from './services/pechVr1ModbusService.js';
import { connectDB } from './services/databaseService.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.static('public'));

// Подключаемся к базе данных
connectDB();

// Запускаем процесс опроса данных
readDataVr1();

app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});
