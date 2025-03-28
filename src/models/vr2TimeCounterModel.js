import mongoose from 'mongoose';

const vr2TimeCounterSchema = new mongoose.Schema({
  currentTime: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true
  }
});

export const Vr2TimeCounterModel = mongoose.model('Vr2TimeCounter', vr2TimeCounterSchema);