const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req, res) => {
  try {
    const { materialId, quantity, manufacturerWallet, supplierWallet, totalPrice } = req.body;
    if (!manufacturerWallet) {
      return res.status(400).json({ error: 'Manufacturer wallet address is required' });
    }
    if (supplierWallet !== process.env.SUPPLIER_ADDRESS) {
      return res.status(400).json({ error: 'Invalid supplier wallet address' });
    }

    const order = new Order({
      materialId,
      quantity,
      manufacturerWallet,
      supplierWallet,
      totalPrice,
      createdAt: new Date(),
    });
    await order.save();
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;