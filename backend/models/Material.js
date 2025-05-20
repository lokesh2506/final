const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: String,
  details: String,
  quantity: Number,
  serialNumber: String,
  batchNumber: String,
  certification: Boolean,
  certifiedAuthority: String,
  pricePerKg: Number,
  supplierWallet: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Material', materialSchema);