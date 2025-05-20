const Fine = require('../models/Fine');

exports.getFinesByManufacturer = async (req, res) => {
  const fines = await Fine.find({ manufacturer: req.params.wallet });
  res.json(fines);
};
