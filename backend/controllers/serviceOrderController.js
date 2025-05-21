const ServiceOrder = require('../models/ServiceOrder');
const Audit = require('../models/Audit');

exports.getServiceOrders = async (req, res) => {
  try {
    const serviceOrders = await ServiceOrder.find();
    res.json(serviceOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createServiceOrder = async (req, res) => {
  try {
    const { serviceId, partName, serviceType, estimatedDelivery } = req.body;

    if (!serviceId || !partName || !serviceType || !estimatedDelivery) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newServiceOrder = new ServiceOrder({
      serviceId,
      partName,
      serviceType,
      estimatedDelivery,
    });

    const savedServiceOrder = await newServiceOrder.save();

    // Create an audit record
    const audit = new Audit({
      auditId: `AUD-${Date.now()}`,
      entity: 'ServiceOrder',
      audited: serviceId,
      date: new Date().toISOString().split('T')[0],
      outcome: 'Created',
      notes: `Service Order ${serviceId} created`,
    });
    await audit.save();

    res.status(201).json(savedServiceOrder);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'serviceId must be unique' });
    }
    res.status(500).json({ error: err.message });
  }
};