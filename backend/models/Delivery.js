// models/Delivery.js
const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: Number,
  materialName: String,
  quantity: Number,
  supplier: String,
  destination: String,
  status: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Delivery', deliverySchema);
