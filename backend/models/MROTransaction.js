const mongoose = require('mongoose');

const mrotransactionSchema = new mongoose.Schema({
  txnId: { type: String, required: true, unique: true },
  date: { type: String, required: true },
  action: { type: String, required: true },
  partName: { type: String, required: true },
  notes: { type: String },
});

module.exports = mongoose.model('MROTransaction', mrotransactionSchema);