const VerificationRequest = require('../models/VerificationRequest');

exports.requestVerification = async (req, res) => {
  const { walletAddress, role } = req.body;
  const existing = await VerificationRequest.findOne({ walletAddress, role });
  if (existing) return res.status(400).json({ error: 'Already requested' });
  const reqEntry = new VerificationRequest({ walletAddress, role });
  await reqEntry.save();
  res.status(201).json({ message: 'Verification requested', reqEntry });
};

exports.approveVerification = async (req, res) => {
  const { walletAddress, role, status } = req.body;
  const request = await VerificationRequest.findOne({ walletAddress, role });
  if (!request) return res.status(404).json({ error: 'Not found' });
  request.status = status;
  await request.save();
  res.json({ message: `Verification ${status}` });
};

exports.getAllVerifications = async (req, res) => {
  const requests = await VerificationRequest.find();
  res.json(requests);
};
    