const Transaction = require('../models/Transaction');

exports.logTransaction = async (req, res) => {
  const tx = new Transaction(req.body);
  await tx.save();
  res.status(201).json({ message: 'Transaction logged', tx });
};

exports.getTransactionsByWallet = async (req, res) => {
  const logs = await Transaction.find({ wallet: req.params.wallet });
  res.json(logs);
};
