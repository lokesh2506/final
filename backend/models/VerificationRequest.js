const mongoose = require('mongoose');
const verificationSchema = new mongoose.Schema({
  walletAddress: String,
  role: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VerificationRequest', verificationSchema);