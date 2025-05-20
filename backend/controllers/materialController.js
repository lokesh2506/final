const Material = require("../models/Material");

exports.createMaterial = async (req, res) => {
  try {
    const material = new Material(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (error) {
    res.status(500).json({ error: "Failed to save material" });
  }
};

exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch materials" });
  }
};
exports.searchMaterials = async (req, res) => {
  try {
    const query = req.query.search || '';
    const regex = new RegExp(query, 'i'); // case-insensitive
    const materials = await Material.find({ name: regex });
    res.json(materials);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search materials" });
  }
};
