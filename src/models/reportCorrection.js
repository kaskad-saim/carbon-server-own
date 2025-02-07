import mongoose from 'mongoose';

const ReportCorrectionSchema = new mongoose.Schema({
  day: {
    type: String, // Формат YYYY-MM-DD
    required: true,
  },
  model: {
    type: String,
    enum: ['DE093', 'DD972', 'DD973', 'DD576', 'DD569', 'DD923', 'DD924'],
    required: true,
  },
  correctedValue: {
    type: Number,
    required: true,
  },
  correctedAt: {
    type: Date,
    default: Date.now,
  },
});

// Добавляем индекс на поля day и model
ReportCorrectionSchema.index({ day: 1, model: 1 }, { unique: true });

export const ReportCorrection = mongoose.model('ReportCorrection', ReportCorrectionSchema);
