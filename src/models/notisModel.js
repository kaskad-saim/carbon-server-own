import mongoose from 'mongoose';

const notisSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number, // Значения числовые
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

export const Notis1Model = mongoose.model('Notis1', notisSchema);
export const Notis2Model = mongoose.model('Notis2', notisSchema);
