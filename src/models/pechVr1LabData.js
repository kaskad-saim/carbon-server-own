import mongoose from 'mongoose';
import labConnection from '../services/databaseLaboratory.js'; // Используем существующее подключение

const pechVr1LabSchema = new mongoose.Schema({
  value: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true });

const PechVr1LabModel = labConnection.model('pechVr1', pechVr1LabSchema);

export default PechVr1LabModel;
