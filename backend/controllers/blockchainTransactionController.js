const BlockchainTransaction = require('../models/BlockchainTransaction');

exports.getBlockchainTransactions = async (req, res) => {
  try {
    const transactions = await BlockchainTransaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};