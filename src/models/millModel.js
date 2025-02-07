import mongoose from 'mongoose';

const millSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Добавляем индекс на поле lastUpdated
millSchema.index({ lastUpdated: 1 });

export const Mill1Model = mongoose.model('Mill1', millSchema);
export const Mill2Model = mongoose.model('Mill2', millSchema);
export const Mill10bModel = mongoose.model('Mill10b', millSchema);
