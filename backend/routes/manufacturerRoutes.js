const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MaterialInventory = require('../models/MaterialInventory');
const Part = require('../models/Part');
const Shipment = require('../models/Shipment');
const QA = require('../models/QA');
const Transaction = require('../models/Transaction');
const { placeOrderOnChain } = require('../utils/blockchain');
const { createMaterial, getMaterials, searchMaterials } = require('../controllers/materialController');

// 📊 Home Stats
router.get('/stats/:wallet', async (req, res) => {
  const wallet = req.params.wallet.toLowerCase();
  try {
    const [
      totalPartsProduced,
      totalTransactions,
      partsShipped,
      materials,
      totalOrders
    ] = await Promise.all([
      Part.countDocuments({ manufacturer: wallet }),
      Transaction.countDocuments({ wallet }),
      Shipment.countDocuments({ from: wallet }),
      MaterialInventory.aggregate([
        { $match: { manufacturer: wallet } },
        { $group: { _id: null, total: { $sum: "$quantityReceived" } } }
      ]),
      Order.countDocuments({ manufacturer: wallet })
    ]);

    const totalMaterials = materials[0]?.total || 0;

    res.json({
      totalPartsProduced,
      totalTransactions,
      partsShipped,
      materialsReceived: totalMaterials,
      totalOrdersReceived: totalOrders
    });
  } catch (err) {
    console.error('❌ Manufacturer stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});
router.get('/search', searchMaterials)
// 🛒 MRO Orders
router.get('/orders/:wallet', async (req, res) => {
  try {
    const orders = await Order.find({ manufacturer: req.params.wallet.toLowerCase() });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// 📦 Material Inventory
router.get('/inventory/:wallet', async (req, res) => {
  try {
    const materials = await MaterialInventory.find({ manufacturer: req.params.wallet.toLowerCase() });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// 🧾 Material Ordering (from Supplier)
router.post('/placeOrder', async (req, res) => {
  try {
    const {
      materialName, quantity, pricePerKg, supplierAddress, manufacturerAddress
    } = req.body;

    const tx = await placeOrderOnChain({
      materialName,
      quantity,
      pricePerKg,
      supplierAddress,
      manufacturerAddress
    });

    res.status(201).json({ message: 'Order placed', txHash: tx.transactionHash });
  } catch (err) {
    res.status(500).json({ error: 'Failed to place order', reason: err.message });
  }
});

// 🛠️ Parts Production
router.get('/parts/:wallet', async (req, res) => {
  try {
    const parts = await Part.find({ manufacturer: req.params.wallet.toLowerCase() });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch parts' });
  }
});

// ✅ QA Section
router.get('/qa/:wallet', async (req, res) => {
  try {
    const qa = await QA.find({ manufacturer: req.params.wallet.toLowerCase() });
    res.json(qa);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch QA data' });
  }
});

// 📦 Shipment Management
router.get('/shipments/:wallet', async (req, res) => {
  try {
    const shipments = await Shipment.find({ from: req.params.wallet.toLowerCase() });
    res.json(shipments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

// 🔗 Transactions
router.get('/transactions/:wallet', async (req, res) => {
  try {
    const txns = await Transaction.find({ wallet: req.params.wallet.toLowerCase() });
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;