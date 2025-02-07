import mongoose from 'mongoose';

const notisSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  status: {
    type: String,
    enum: ['idle', 'working'],
    default: 'working',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Добавляем индексы на поля lastUpdated и status
notisSchema.index({ lastUpdated: 1 });
notisSchema.index({ status: 1 });

export const Notis1Model = mongoose.model('Notis1', notisSchema);
export const Notis2Model = mongoose.model('Notis2', notisSchema);
