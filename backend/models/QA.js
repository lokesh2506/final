const mongoose = require('mongoose');
const qaSchema = new mongoose.Schema({
  partName: String,
  manufacturer: String,
  status: { type: String, enum: ['pending', 'passed', 'failed'], default: 'pending' },
  inspectionDate: { type: Date, default: Date.now },
  remarks: String
});
module.exports = mongoose.model('QA', qaSchema);