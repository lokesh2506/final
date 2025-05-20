const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  metric: String,
  value: String,
  unit: String,
});

module.exports = mongoose.model('Metric', metricSchema);