  const express = require('express');
  const router = express.Router();
  const Order = require('../models/Order');

  router.post('/create', async (req, res) => {
    const { materialName, quantity, supplier, manufacturer, totalPrice } = req.body;
    try {
      const newOrder = new Order({
        materialName,
        quantity,
        supplier,
        manufacturer,
        totalPrice,
        status: 'pending',
      });
      await newOrder.save();
      res.status(201).json({ message: 'Order created', order: newOrder });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  router.get('/', async (req, res) => {
    try {
      const orders = await Order.find();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });

  module.exports = router;