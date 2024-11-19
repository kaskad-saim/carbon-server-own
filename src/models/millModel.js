// models/millModel.js

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

export const Mill1Model = mongoose.model('Mill1', millSchema);
export const Mill2Model = mongoose.model('Mill2', millSchema);
