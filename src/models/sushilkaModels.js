import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  temperatures: Object,
  vacuums: Object,
  gorelka: Object,
  im: Object,
  lastUpdated: Date,
});

// Создаем модели для Sushilka1 и Sushilka2
const Sushilka1Model = mongoose.model('sushilka1Models', dataSchema);
const Sushilka2Model = mongoose.model('sushilka2Models', dataSchema);

// Экспортируем обе модели
export { Sushilka1Model, Sushilka2Model };
