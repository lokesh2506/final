const Metric = require('../models/Metric');

exports.getMetrics = async (req, res) => {
  try {
    const metrics = await Metric.find();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};