const Inspection = require('../models/Inspection');

exports.getInspections = async (req, res) => {
  try {
    const inspections = await Inspection.find();
    res.json(inspections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};