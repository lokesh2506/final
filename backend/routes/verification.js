const express = require('express');
const router = express.Router();
const VerificationRequest = require('../models/VerificationRequest');

router.post('/request', async (req, res) => {
  const { walletAddress, role } = req.body;
  const existing = await VerificationRequest.findOne({ walletAddress, role });
  if (existing) return res.status(400).json({ error: 'Already requested' });
  const reqEntry = new VerificationRequest({ walletAddress, role });
  await reqEntry.save();
  res.status(201).json({ message: 'Verification requested', reqEntry });
});

router.post('/approve', async (req, res) => {
  const { walletAddress, role, status } = req.body;
  const request = await VerificationRequest.findOne({ walletAddress, role });
  if (!request) return res.status(404).json({ error: 'Not found' });
  request.status = status;
  await request.save();
  res.json({ message: `Verification ${status}` });
});

router.get('/requests', async (req, res) => {
  const requests = await VerificationRequest.find();
  res.json(requests);
});

module.exports = router;
