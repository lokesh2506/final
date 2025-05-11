const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.get('/search', async (req, res) => {
  try {
    const { search } = req.query;
    if (!search) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const materials = await Material.find({
      name: { $regex: search, $options: 'i' },
    }).select('name details quantity serialNumber batchNumber certification certifiedAuthority pricePerKg supplierWallet _id');
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/add', async (req, res) => {
  try {
    const { name, details, quantity, serialNumber, batchNumber, certification, certifiedAuthority, pricePerKg } = req.body;
    const material = new Material({
      name,
      details,
      quantity,
      serialNumber,
      batchNumber,
      certification,
      certifiedAuthority: certification ? certifiedAuthority : '',
      pricePerKg,
      supplierWallet: process.env.SUPPLIER_ADDRESS,
      partId: await Material.countDocuments() + 1
    });
    await material.save();
    res.status(201).json({ message: 'Material added successfully', material });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;