const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  certificationId: { type: String, required: true, unique: true },
  type: String,
  entity: String,
  date: String,
  expiryDate: String,
});

module.exports = mongoose.model('Certification', certificationSchema);