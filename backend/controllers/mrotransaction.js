const Transaction = require('../models/MROTransaction');
const Audit = require('../models/Audit');

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { txnId, date, action, partName, notes } = req.body;

    if (!txnId || !date || !action || !partName) {
      return res.status(400).json({ error: 'txnId, date, action, and partName are required' });
    }

    const newTransaction = new Transaction({
      txnId,
      date,
      action,
      partName,
      notes,
    });

    const savedTransaction = await newTransaction.save();

    // Create an audit record
    const audit = new Audit({
      auditId: `AUD-${Date.now()}`,
      entity: 'Transaction',
      audited: txnId,
      date: new Date().toISOString().split('T')[0],
      outcome: 'Created',
      notes: `Transaction ${txnId} created`,
    });
    await audit.save();

    res.status(201).json(savedTransaction);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'txnId must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};