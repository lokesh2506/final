const mongoose = require('mongoose');
const auditSchema = new mongoose.Schema({
  auditorWallet: String,
  targetRole: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Audit', auditSchema);