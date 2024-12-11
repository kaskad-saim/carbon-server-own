import cron from 'node-cron';
import { generateDailyReport } from './reportService.js';
import logger from '../logger.js';

const startCronJobs = () => {
  // Обновляем данные каждый час
  cron.schedule('0 * * * *', async () => { // Запуск в начале каждого часа
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dayString = yesterday.toISOString().slice(0, 10);

    try {
      logger.info(`Запуск автоматической генерации отчета за ${dayString}`);
      await generateDailyReport(dayString);
      logger.info(`Суточный отчет за ${dayString} успешно сформирован.`);
    } catch (error) {
      logger.error(`Автоматическая генерация суточного отчета за ${dayString} не удалась: ${error.message}`, error);
    }
  });
};

export default startCronJobs;
