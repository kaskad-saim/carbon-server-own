import mongoose from 'mongoose';

const reactorSchema = new mongoose.Schema({
  temperatures: {
    type: Map,
    of: Number,
  },
  levels: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Добавляем индекс на поле lastUpdated
reactorSchema.index({ lastUpdated: 1 });

export const Reactor296Model = mongoose.model('ReactorK296', reactorSchema);
