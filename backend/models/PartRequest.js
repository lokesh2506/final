const mongoose = require('mongoose');

const partRequestSchema = new mongoose.Schema({
  requestId: { type: String, required: true, unique: true },
  partName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  requiredBy: { type: String, required: true },
  status: { type: String, default: 'Requested', enum: ['Requested', 'In Process', 'Fulfilled', 'Cancelled'] },
});

module.exports = mongoose.model('PartRequest', partRequestSchema);