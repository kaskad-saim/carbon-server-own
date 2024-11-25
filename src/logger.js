import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import DailyRotateFile from 'winston-daily-rotate-file'; // Импортируем winston-daily-rotate-file

// Определяем текущую директорию
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Проверяем, существует ли директория логов, и создаем ее при необходимости
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Создаем форматирование для логгера
const loggerFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Создаем логгер
const logger = winston.createLogger({
  level: 'info', // Минимальный уровень логирования
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    loggerFormat
  ),
  transports: [
    // Транспорт для ротации логов
    new DailyRotateFile({
      filename: path.join(logsDir, 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error', // Записываем только ошибки
      zippedArchive: false, // Можно установить в true, если хотите архивировать старые логи
      maxSize: '20m', // Максимальный размер файла лога
      maxFiles: '7d', // Хранить логи за последние 7 дней
    }),
    // Транспорт для вывода минимальной информации в консоль
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'HH:mm:ss' }), // Форматируем время без даты
        winston.format.printf(({ level, message, timestamp }) => {
          if (level === 'error') {
            return `[${timestamp}] Ошибка записана в лог.`;
          }
          return message;
        })
      ),
    }),
  ],
});

// Создаем кеш для отслеживания повторяющихся ошибок
const errorCache = {};
const ERROR_CACHE_DURATION = 15000; // Задержка между одинаковыми ошибками в миллисекундах

// Сохраняем оригинальный метод logger.error
const originalLoggerError = logger.error.bind(logger);

// Переопределяем метод logger.error для реализации задержки между одинаковыми ошибками
logger.error = (message) => {
  const now = Date.now();
  const cacheKey = message; // Можно использовать хеш от сообщения, если сообщения большие

  if (!errorCache[cacheKey] || now - errorCache[cacheKey] > ERROR_CACHE_DURATION) {
    // Обновляем время последнего логирования ошибки
    errorCache[cacheKey] = now;
    // Вызываем оригинальный метод logger.error
    originalLoggerError(message);
  } else {
    // Повторная ошибка не записана в лог
    console.log('Повторная ошибка не записана в лог.');
  }
};

// Экспортируем логгер
export default logger;
