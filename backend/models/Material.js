const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pricePerKg: {
    type: Number,
    required: true,
  },
  certified: {
    type: Boolean,
    default: false,
  },
  supplier: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Material', materialSchema);