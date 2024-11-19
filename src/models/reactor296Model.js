// models/reactorModel.js

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

export const Reactor296Model = mongoose.model('ReactorK296', reactorSchema);
