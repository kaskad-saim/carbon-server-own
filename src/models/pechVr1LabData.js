import mongoose from 'mongoose';
import labConnection from '../services/databaseLaboratory.js'; // Используем существующее подключение

const pechVr1LabSchema = new mongoose.Schema({
  value: { type: String, default: '-' },
  valueTime: { type: String, default: '-' },
  valueDate: { type: String, default: '-' },

  valuePH: { type: String, default: '-' },
  valuePHTime: { type: String, default: '-' },
  valuePHDate: { type: String, default: '-' },

  valueSUM: { type: String, default: '-' },
  valueSUMTime: { type: String, default: '-' },
  valueSUMDate: { type: String, default: '-' },

  recordTime: { type: String, default: '-' },
  recordDate: { type: String, default: '-' },
}, { timestamps: true });




const PechVr1LabModel = labConnection.model('pechVr1', pechVr1LabSchema);

export default PechVr1LabModel;
