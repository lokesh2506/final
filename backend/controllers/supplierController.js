const Material = require('../models/Material');

exports.addMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json({ message: 'Material added', material });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMaterialsBySupplier = async (req, res) => {
  const materials = await Material.find({ supplierWallet: req.params.wallet });
  res.json(materials);
};