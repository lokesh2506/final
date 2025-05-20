const mongoose = require('mongoose');
const inspectionSchema = new mongoose.Schema({
  inspectorWallet: String,
  entityWallet: String,
  findings: String,
  result: String,
  date: Date,
});

module.exports = mongoose.model('Inspection', inspectionSchema);s