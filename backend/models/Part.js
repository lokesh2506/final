const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  manufacturerWallet: String,
  partName: String,
  serialNumber: String,
  status: String,
  manufacturingDate: String,
  deliveryDate: String,
});

module.exports = mongoose.model('Part', PartSchema);
