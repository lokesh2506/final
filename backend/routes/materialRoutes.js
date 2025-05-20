const express = require('express');
const router = express.Router();
const Material = require('../models/Material');
const {
  createMaterial,
  getMaterials,
  searchMaterials
} = require('../controllers/materialController');
router.post('/create', createMaterial);
router.get('/all', getMaterials);
router.get('/search', searchMaterials); 

router.get('/search', async (req, res) => {
  try {
    const name = req.query.name || '';
    const results = await Material.find({ name: { $regex: name, $options: 'i' } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
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
