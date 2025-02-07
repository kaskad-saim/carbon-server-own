import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
  temperatures: Object,
  pressures: Object,
  vacuums: Object,
  lastUpdated: Date,
});

// Добавляем индекс на поле lastUpdated
dataSchema.index({ lastUpdated: 1 });

const PechMpa2Model = mongoose.model('pechMpa2Models', dataSchema);
const PechMpa3Model = mongoose.model('pechMpa3Models', dataSchema);

export { PechMpa2Model, PechMpa3Model };
