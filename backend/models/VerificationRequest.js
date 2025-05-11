const mongoose = require('mongoose');

const verificationRequestSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'approved', 'rejected'] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VerificationRequest', verificationRequestSchema);