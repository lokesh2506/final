const mongoose = require('mongoose');

const inspectionSchema = new mongoose.Schema({
  inspectionId: { type: String, required: true, unique: true },
  entity: String,
  date: String,
  outcome: String,
  nextInspectionDate: String,
});

module.exports = mongoose.model('Inspection', inspectionSchema);