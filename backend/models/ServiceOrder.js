const mongoose = require('mongoose');

const serviceOrderSchema = new mongoose.Schema({
  serviceId: { type: String, required: true, unique: true },
  partName: { type: String, required: true },
  serviceType: { type: String, required: true },
  estimatedDelivery: { type: String, required: true },
});

module.exports = mongoose.model('ServiceOrder', serviceOrderSchema);