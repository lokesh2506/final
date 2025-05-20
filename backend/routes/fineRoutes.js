const express = require('express');
const router = express.Router();
const Fine = require('../models/Fine');

router.get('/manufacturer/:wallet', async (req, res) => {
  const fines = await Fine.find({ manufacturer: req.params.wallet });
  res.json(fines);
});

router.get('/all', async (req, res) => {
  const fines = await Fine.find();
  res.json(fines);
});

module.exports = router;