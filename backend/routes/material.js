const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

router.post('/', async (req, res) => {
  const material = new Material(req.body);
  await material.save();
  res.status(201).json(material);
});

router.get('/:materialId', async (req, res) => {
  const material = await Material.findOne({ materialId: req.params.materialId });
  if (!material) return res.status(404).json({ message: 'Material not found' });
  res.json(material);
});

router.get('/supplier/:address', async (req, res) => {
  const materials = await Material.find({ supplierAddress: req.params.address });
  res.json(materials);
});

router.put('/:materialId', async (req, res) => {
  const material = await Material.findOneAndUpdate(
    { materialId: req.params.materialId },
    req.body,
    { new: true }
  );
  res.json(material);
});

router.delete('/:materialId', async (req, res) => {
  await Material.deleteOne({ materialId: req.params.materialId });
  res.json({ message: 'Material deleted' });
});

module.exports = router;