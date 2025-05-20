const mongoose = require('mongoose');
const transactionSchema = new mongoose.Schema({
  role: String,
  wallet: String,
  action: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Transaction', transactionSchema);