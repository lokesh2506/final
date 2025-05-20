const Violation = require('../models/Violation');

exports.getViolations = async (req, res) => {
  try {
    const violations = await Violation.find();
    res.json(violations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};