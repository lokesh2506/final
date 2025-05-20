const mongoose = require('mongoose');

const complianceSchema = new mongoose.Schema({
  entityId: { type: String, required: true, unique: true },
  entityType: String,
  complianceStatus: String,
  certificationStatus: String,
  lastInspectionDate: String,
});

module.exports = mongoose.model('Compliance', complianceSchema);