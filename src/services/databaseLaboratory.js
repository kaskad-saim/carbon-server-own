import mongoose from 'mongoose';

// Прямая строка подключения к лабораторной базе данных
const LAB_URI = 'mongodb://127.0.0.1:27017/laboratory';

// Создаем одно подключение и экспортируем его
const labConnection = mongoose.createConnection(LAB_URI);

labConnection.on('connected', () => {
  console.log('Подключено к лабораторной MongoDB');
});

labConnection.on('error', (error) => {
  console.error('Ошибка подключения к лабораторной MongoDB:', error);
});

export default labConnection;
