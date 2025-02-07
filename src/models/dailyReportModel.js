import mongoose from 'mongoose';

const DailyReportSchema = new mongoose.Schema({
  date: {
    type: String, // Формат YYYY-MM-DD
    unique: true,
    required: true,
  },
  data: {
    DE093: { type: Number, default: 0 },
    DD972: { type: Number, default: 0 },
    DD973: { type: Number, default: 0 },
    DD576: { type: Number, default: 0 },
    DD569: { type: Number, default: 0 },
    DD923: { type: Number, default: 0 },
    DD924: { type: Number, default: 0 },
  },
});

// Добавляем индекс на поле date
DailyReportSchema.index({ date: 1 });

export const DailyReportModel = mongoose.model('DailyReport', DailyReportSchema);
