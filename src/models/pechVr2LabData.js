import mongoose from 'mongoose';
import labConnection from '../services/databaseLaboratory.js'; // Используем существующее подключение

const pechVr2LabSchema = new mongoose.Schema({
  value: { type: String, required: true },
  time: { type: String, required: true },
  date: { type: String, required: true },
}, { timestamps: true });

const PechVr2LabModel = labConnection.model('pechVr2', pechVr2LabSchema);

export default PechVr2LabModel;
