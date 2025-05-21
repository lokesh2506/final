const Audit = require('../models/Audit');

exports.getAudits = async (req, res) => {
  try {
    const audits = await Audit.find();
    res.json(audits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAudit = async (req, res) => {
  try {
    const { auditId, entity, audited, date, outcome, notes } = req.body;

    if (!auditId) {
      return res.status(400).json({ error: 'auditId is required' });
    }

    const newAudit = new Audit({
      auditId,
      entity,
      audited,
      date,
      outcome,
      notes,
    });

    const savedAudit = await newAudit.save();
    res.status(201).json(savedAudit);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'auditId must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};