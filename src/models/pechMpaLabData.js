import mongoose from 'mongoose';
import labConnection from '../services/databaseLaboratory.js'; // Используем существующее подключение

const labSchema = new mongoose.Schema({
  value: { type: String, default: '-' },
  valueTime: { type: String, default: '-' },
  valueDate: { type: String, default: '-' },

  recordTime: { type: String, default: '-' },
  recordDate: { type: String, default: '-' },
}, { timestamps: true });

labSchema.index({ valueDate: 1 });
labSchema.index({ recordDate: 1 });

export const PechMpa2LabModel = labConnection.model('pechMpa2', labSchema);
export const PechMpa3LabModel = labConnection.model('pechMpa3', labSchema);
