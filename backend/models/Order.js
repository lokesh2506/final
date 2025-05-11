const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  supplier: {
    type: String,
    required: true,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'supplied', 'delivered'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);