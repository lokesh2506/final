const ServiceOrder = require('../models/ServiceOrder');
const PartRequest = require('../models/PartRequest');
const Transaction = require('../models/Transaction');

exports.getDashboardMetrics = async (req, res) => {
  try {
    const ongoingOrders = await ServiceOrder.countDocuments();
    const availableParts = await PartRequest.countDocuments({ status: 'Fulfilled' });
    const completedOrders = await Transaction.countDocuments({ action: 'Part Serviced' });
    const totalTransactions = await Transaction.countDocuments();

    res.json({
      totalOngoingOrders: ongoingOrders,
      totalAvailableParts: availableParts,
      totalCompletedOrders: completedOrders,
      totalTransactions: totalTransactions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};