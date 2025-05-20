const Compliance = require('../models/Compliance');

exports.getCompliance = async (req, res) => {
  try {
    const compliance = await Compliance.find();
    res.json(compliance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};