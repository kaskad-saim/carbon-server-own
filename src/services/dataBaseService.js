import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoURI = 'mongodb://127.0.0.1:27017/carbon';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log('Подключено к MongoDB');
  } catch (error) {
    console.error('Ошибка подключения к MongoDB:', error);
  }
};
