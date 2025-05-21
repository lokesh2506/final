const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
// ✅ GET all deliveries for a specific supplier wallet
router.get('/supplier/:wallet', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ supplier: req.params.wallet.toLowerCase() });
    res.json(deliveries);
  } catch (err) {
    console.error('Error fetching supplier deliveries:', err);
    res.status(500).json({ error: 'Failed to load supplier deliveries' });
  }
});

// ✅ GET all deliveries for a specific manufacturer wallet
router.get('/manufacturer/:wallet', async (req, res) => {
  try {
    const orders = await Order.find({ manufacturer: req.params.wallet.toLowerCase() });
    res.json(orders);
  } catch (err) {
    console.error('❌ Failed to fetch manufacturer orders:', err);
    res.status(500).json({ error: 'Failed to load manufacturer orders' });
  }
});




// ✅ POST - create and save a delivery (used after blockchain supply)
router.post('/create', async (req, res) => {
  try {
    const delivery = new Delivery({
      orderId: req.body.orderId,
      materialName: req.body.materialName,
      quantity: req.body.quantity,
      supplier: req.body.supplier.toLowerCase(),
      manufacturer: req.body.manufacturer.toLowerCase(),
      status: req.body.status || 'supplied',
      trackingNumber: req.body.trackingNumber,
      deliveryDate: req.body.deliveryDate || new Date(),
    });

    await delivery.save();
    res.status(201).json({ message: '✅ Delivery saved', delivery });
  } catch (err) {
    console.error('Error saving delivery:', err);
    res.status(500).json({ error: '❌ Failed to save delivery' });
  }
});

module.exports = router;
