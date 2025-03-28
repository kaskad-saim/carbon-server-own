import mongoose from 'mongoose';

const vr1TimeCounterSchema = new mongoose.Schema({
  currentTime: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true
  }
});

export const Vr1TimeCounterModel = mongoose.model('Vr1TimeCounter', vr1TimeCounterSchema);