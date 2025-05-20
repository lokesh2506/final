const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
router.post('/save', async (req, res) => {
  try {
    const tx = new Transaction(req.body);
    await tx.save();
    res.status(201).json({ message: 'Transaction saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save transaction' });
  }
});
router.get('/:wallet', async (req, res) => {
  try {
    const wallet = req.params.wallet.toLowerCase();
    const txs = await Transaction.find({
      wallet: { $regex: new RegExp(`^${wallet}$`, 'i') } // case-insensitive
    }).sort({ timestamp: -1 });

    res.json(txs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

module.exports = router;
