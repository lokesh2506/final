const Fine = require('../models/Fine');
const Verification = require('../models/VerificationRequest');

exports.getFines = async (req, res) => {
  const fines = await Fine.find();
  res.json(fines);
};

exports.getVerifications = async (req, res) => {
  const verifications = await Verification.find();
  res.json(verifications);
};