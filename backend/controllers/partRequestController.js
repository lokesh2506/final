const PartRequest = require('../models/PartRequest');
const Audit = require('../models/Audit');

exports.getPartRequests = async (req, res) => {
  try {
    const partRequests = await PartRequest.find();
    res.json(partRequests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPartRequest = async (req, res) => {
  try {
    const { requestId, partName, quantity, requiredBy } = req.body;

    if (!requestId || !partName || !quantity || !requiredBy) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPartRequest = new PartRequest({
      requestId,
      partName,
      quantity,
      requiredBy,
      status: 'Requested', // Always set to 'Requested' on creation
    });

    const savedPartRequest = await newPartRequest.save();

    // Create an audit record
    const audit = new Audit({
      auditId: `AUD-${Date.now()}`,
      entity: 'PartRequest',
      audited: requestId,
      date: new Date().toISOString().split('T')[0],
      outcome: 'Created',
      notes: `Part Request ${requestId} created`,
    });
    await audit.save();

    res.status(201).json(savedPartRequest);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'requestId must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};