const Audit = require('../models/Audit');

exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};