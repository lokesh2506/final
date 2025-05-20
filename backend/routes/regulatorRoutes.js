const express = require('express');
const router = express.Router();
const Fine = require('../models/Fine');
const Verification = require('../models/VerificationRequest');

router.get('/fines', async (req, res) => {
  const fines = await Fine.find();
  res.json(fines);
});

router.get('/verifications', async (req, res) => {
  const verifications = await Verification.find();
  res.json(verifications);
});

module.exports = router;