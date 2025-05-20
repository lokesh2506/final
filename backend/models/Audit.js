const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
  auditId: { type: String, required: true, unique: true },
  entity: String,
  date: String,
  outcome: String,
  notes: String,
});

module.exports = mongoose.model('Audit', auditSchema);