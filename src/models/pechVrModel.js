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

const PechVr1Model = mongoose.model('pechVr1Models', dataSchema);

export default PechVr1Model;
