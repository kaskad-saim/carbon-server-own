import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  temperatures: Object,
  levels: Object,
  pressures: Object,
  vacuums: Object,
  im: Object,
  gorelka: Object,
  lastUpdated: Date,
});

// Добавляем индекс на поле lastUpdated
dataSchema.index({ lastUpdated: 1 });

const PechVr1Model = mongoose.model('pechVr1Models', dataSchema);
const PechVr2Model = mongoose.model('pechVr2Models', dataSchema);

// Экспортируем обе модели
export { PechVr1Model, PechVr2Model };
