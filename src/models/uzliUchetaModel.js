import mongoose from 'mongoose';

// БД для энергоресурсов МПА2
const DE093Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDE093Model = mongoose.model('DE093', DE093Schema);

// БД для энергоресурсов МПА3
const DD972Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD972Model = mongoose.model('DD972', DD972Schema);

// БД для энергоресурсов МПА4
const DD973Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD973Model = mongoose.model('DD973', DD973Schema);

// БД для энергоресурсов генерации CARBON к10в1
const DD576Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD576Model = mongoose.model('DD576', DD576Schema);

// БД для энергоресурсов генерации от к265 к к10в1
const DD569Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD569Model = mongoose.model('DD569', DD569Schema);

// БД генерация котел-утилизатор 1
const DD923Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD923Model = mongoose.model('DD923', DD923Schema);

// БД генерация котел-утилизатор 2
const DD924Schema = new mongoose.Schema({
  data: {
    type: Map,
    of: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    index: true // Добавляем индекс
  },
});

export const imDD924Model = mongoose.model('DD924', DD924Schema);
