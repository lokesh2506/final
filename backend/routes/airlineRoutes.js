const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.get('/flightRecords/:wallet', async (req, res) => {
  const records = await Order.find({ airlineWallet: req.params.wallet });
  res.json(records);
});

module.exports = router;