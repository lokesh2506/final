const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
  violationId: { type: String, required: true, unique: true },
  entity: String,
  type: String,
  description: String,
  dateReported: String,
});

module.exports = mongoose.model('Violation', violationSchema);