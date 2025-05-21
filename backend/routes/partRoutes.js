const express = require('express');
const router = express.Router();
const Part = require('../models/Part');

router.post('/add', async (req, res) => {
  try {
    const newPart = new Part(req.body);
    await newPart.save();
    res.status(201).json({ message: '✅ Part saved', part: newPart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '❌ Failed to save part' });
  }
});

module.exports = router;
