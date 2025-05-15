import mongoose from 'mongoose';

const press3Schema = new mongoose.Schema({
  controllerData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,  // здесь будем хранить и boolean, и number
    required: true,
  },
  termodatData: {
    type: Map,
    of: Number,                       // здесь только числа
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// индекс по дате для быстрой выборки последних записей
press3Schema.index({ lastUpdated: 1 });

export const Press3Model = mongoose.model('Press3', press3Schema);
