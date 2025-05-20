const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  entityWallet: String,
  standard: String,
  validUntil: Date,
  issuedBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Certification', certificationSchema);