const mongoose = require('mongoose');

const blockchainTransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  date: String,
  entity: String,
  type: String,
  notes: String,
});

module.exports = mongoose.model('BlockchainTransaction', blockchainTransactionSchema);