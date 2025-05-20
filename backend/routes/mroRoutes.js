const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/placeOrder', async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).json({ message: 'Order placed', order });
});

router.get('/orders/:wallet', async (req, res) => {
  const orders = await Order.find({ mroWallet: req.params.wallet });
  res.json(orders);
});

module.exports = router;