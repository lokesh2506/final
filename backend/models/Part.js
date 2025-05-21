const mongoose = require('mongoose');

const PartSchema = new mongoose.Schema({
  partName: String,
  serialBatch: String,
  materialUsed: String,
  status: String,
  manufactureDate: String,
  deliveryDate: String,
  createdBy: String,
});

module.exports = mongoose.model('Part', PartSchema);
