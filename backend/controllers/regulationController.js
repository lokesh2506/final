const Regulation = require('../models/Regulation');

exports.getRegulations = async (req, res) => {
  try {
    const regulations = await Regulation.find();
    res.json(regulations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};