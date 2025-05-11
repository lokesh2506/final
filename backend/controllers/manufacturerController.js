const Material = require("../models/Material");

exports.addMaterial = async (req, res) => {
  try {
    const m = new Material(req.body);
    await m.save();
    res.status(201).send(m);
  } catch (e) {
    res.status(400).send(e);
  }
};

exports.searchMaterial = async (req, res) => {
  try {
    const q = req.query.search || "";
    const list = await Material.find({
      name: { $regex: q, $options: "i" }
    });
    res.send(list);
  } catch (e) {
    res.status(500).send(e);
  }
};
