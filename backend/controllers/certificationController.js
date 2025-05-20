const Certification = require('../models/Certification');

exports.getCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};