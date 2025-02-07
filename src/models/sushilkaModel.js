import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  temperatures: Object,
  vacuums: Object,
  gorelka: Object,
  im: Object,
  lastUpdated: Date,
});

// Добавляем индекс на поле lastUpdated
dataSchema.index({ lastUpdated: 1 });

const Sushilka1Model = mongoose.model('sushilka1Models', dataSchema);
const Sushilka2Model = mongoose.model('sushilka2Models', dataSchema);

export { Sushilka1Model, Sushilka2Model };