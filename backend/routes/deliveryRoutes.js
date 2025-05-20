const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');

router.get('/supplier/:wallet', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ supplierWallet: req.params.wallet });
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load deliveries' });
  }
});

module.exports = router;
