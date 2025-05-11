const express = require('express');
const router = express.Router();
const VerificationRequest = require('../models/VerificationRequest');

router.post('/request', async (req, res) => {
  try {
    const { walletAddress, role } = req.body;
    console.log("Verification Request:", { walletAddress, role });

    if (!walletAddress || !role) {
      return res.status(400).json({ error: "Missing required fields: walletAddress and role are required" });
    }

    const existingRequest = await VerificationRequest.findOne({
      walletAddress: walletAddress.toLowerCase(),
      role,
    });
    if (existingRequest) {
      return res.status(400).json({ error: "Verification request already exists for this wallet and role" });
    }

    const request = new VerificationRequest({
      walletAddress: walletAddress.toLowerCase(),
      role,
      status: 'pending',
    });
    await request.save();

    res.status(201).json({ message: "Verification request submitted", request });
  } catch (error) {
    console.error("Error in verification request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const requests = await VerificationRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching verification requests:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/approve', async (req, res) => {
  try {
    const { walletAddress, role, status } = req.body;
    const request = await VerificationRequest.findOne({
      walletAddress: walletAddress.toLowerCase(),
      role,
    });
    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }
    request.status = status;
    await request.save();
    res.status(200).json({ message: `Request ${status}` });
  } catch (error) {
    console.error("Error updating verification request:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;