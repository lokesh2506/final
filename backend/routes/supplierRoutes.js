const express = require('express');
const router = express.Router();

const Material = require('../models/Material');
const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const Transaction = require('../models/Transaction');
const { addMaterialOnChain } = require('../utils/blockchain');

// ✅ Get all materials for a supplier
router.get('/materials/:wallet', async (req, res) => {
  try {
    const materials = await Material.find({ supplierWallet: req.params.wallet.toLowerCase() });
    res.json(materials);
  } catch (err) {
    console.error('❌ Failed to load materials:', err);
    res.status(500).json({ error: 'Failed to load materials' });
  }
});

// ✅ Supplier dashboard stats (includes quantity)
router.get('/stats/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();

    const [totalMaterials, totalOrders, totalTransactions, materialDocs] = await Promise.all([
      Material.countDocuments({ supplierWallet: wallet }),
      Order.countDocuments({ supplier: wallet }),
      Transaction.countDocuments({ wallet }),
      Material.find({ supplierWallet: wallet })
    ]);

    const totalQuantity = materialDocs.reduce((sum, m) => sum + (m.quantity || 0), 0);

    res.json({ totalMaterials, totalOrders, totalTransactions, totalQuantity });
  } catch (err) {
    console.error('❌ Failed to load stats:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats' });
  }
});

// ✅ Get orders for a supplier
router.get('/orders/:wallet', async (req, res) => {
  try {
    const orders = await Order.find({ supplier: req.params.wallet.toLowerCase() });
    res.json(orders);
  } catch (err) {
    console.error('❌ Failed to load orders:', err);
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// ✅ Get deliveries for a supplier
router.get('/deliveries/:wallet', async (req, res) => {
  try {
    const deliveries = await Delivery.find({ supplierWallet: req.params.wallet.toLowerCase() });
    res.json(deliveries);
  } catch (err) {
    console.error('❌ Failed to load deliveries:', err);
    res.status(500).json({ error: 'Failed to load deliveries' });
  }
});

// ✅ Add new material (Blockchain + MongoDB + Transaction)
router.post('/addMaterial', async (req, res) => {
  console.log("📥 Received addMaterial request:", req.body);

  try {
    const {
      materialName,
      materialDetails,
      quantity,
      serialNumber,
      batchNumber,
      certification,
      certifiedAuthority = "",
      pricePerKg,
      supplierWallet
    } = req.body;

    const walletLower = supplierWallet.toLowerCase();

    // ✅ Validation
    if (!materialName || !materialDetails || !quantity || !serialNumber || !batchNumber || !pricePerKg || !supplierWallet) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // ✅ Step 1: Blockchain transaction
    console.log("🚀 Calling smart contract addMaterial...");
    const txReceipt = await addMaterialOnChain({
      name: materialName,
      details: materialDetails,
      quantity: parseInt(quantity),
      serialNumber,
      batchNumber,
      certification,
      certifiedAuthority,
      pricePerKg: parseFloat(pricePerKg),
      fromAddress: supplierWallet
    });

    console.log("✅ Blockchain transaction hash:", txReceipt.transactionHash);

    // ✅ Step 2: Save to MongoDB
    const newMaterial = new Material({
      name: materialName,
      details: materialDetails,
      quantity: parseInt(quantity),
      serialNumber,
      batchNumber,
      certification,
      certifiedAuthority,
      pricePerKg: parseFloat(pricePerKg),
      supplierWallet: walletLower
    });

    await newMaterial.save();
    console.log("✅ Material stored in MongoDB");

    // ✅ Step 3: Log transaction
    await Transaction.create({
      role: 'Supplier',
      wallet: walletLower,
      action: `Added material: ${materialName}`,
      timestamp: new Date(),
    });

    // ✅ Respond
    res.status(201).json({
      message: 'Material added successfully',
      txHash: txReceipt.transactionHash
    });

  } catch (err) {
    console.error("❌ addMaterial failed:", err);
    res.status(500).json({
      error: 'Failed to add material on-chain or store in DB',
      reason: err.message
    });
  }
});

module.exports = router;
