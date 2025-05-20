const mongoose = require('mongoose');

const regulationSchema = new mongoose.Schema({
  regulationId: { type: String, required: true, unique: true },
  title: String,
  description: String,
  status: String,
  lastUpdate: String,
});

module.exports = mongoose.model('Regulation', regulationSchema);