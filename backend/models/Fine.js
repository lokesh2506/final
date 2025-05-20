const mongoose = require('mongoose');

const FineSchema = new mongoose.Schema({
  manufacturer: String,
  mro: String,
  orderId: String,
  requiredDeliveryDate: Date,
  actualDeliveryDate: Date,
  fineAmount: Number,
}, { timestamps: true });

module.exports = mongoose.model('Fine', FineSchema);