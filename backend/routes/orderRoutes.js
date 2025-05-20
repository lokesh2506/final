const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

router.post('/create', async (req, res) => {
  const {
    materialName,
    quantity,
    supplier,
    manufacturer,
    totalPrice,
    contractOrderId
  } = req.body;

  if (!contractOrderId) {
    return res.status(400).json({ error: "Missing contractOrderId in database!" });
  }

  try {
    const newOrder = new Order({
      materialName,
      quantity,
      supplier: supplier.toLowerCase(),
      manufacturer,
      totalPrice,
      contractOrderId,
      status: 'pending',
    });

    await newOrder.save();
    res.status(201).json({ message: '✅ Order created', order: newOrder });
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ message: '❌ Server error', error: error.message });
  }
});

// ✅ Get all orders for a supplier
router.get('/supplier/:wallet', async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.params.wallet.toLowerCase() });
    res.json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch supplier orders:', err);
    res.status(500).json({ error: 'Failed to load supplier orders' });
  }
});

// ✅ Update order status (e.g., after on-chain delivery)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: '✅ Order updated', updated });
  } catch (err) {
    console.error('❌ Failed to update order:', err);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

module.exports = router;
