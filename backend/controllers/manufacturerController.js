const Order = require('../models/Order');
const Fine = require('../models/Fine');
const { orderMaterialOnChain } = require('../utils/blockchain');
const {
  recordPartProduction,
  performQualityCheck,
  shipParts
} = require('../utils/blockchain');

exports.deliverOrder = async (req, res) => {
  const { orderId, actualDeliveryDate } = req.body;
  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  order.actualDeliveryDate = new Date(actualDeliveryDate);
  order.status = 'delivered';
  await order.save();

  const required = new Date(order.requiredDeliveryDate);
  const actual = new Date(actualDeliveryDate);

  if (actual > required) {
    const lateDays = Math.ceil((actual - required) / (1000 * 60 * 60 * 24));
    const fineAmount = lateDays * 100;
    await Fine.create({
      manufacturer: order.manufacturerWallet,
      mro: order.mroWallet,
      orderId: order._id,
      requiredDeliveryDate: required,
      actualDeliveryDate: actual,
      fineAmount,
    });
  }

  res.json({ message: 'Delivery updated', order });
};

exports.orderMaterial = async (req, res) => {
  try {
    const { materialId, quantity, manufacturerWallet } = req.body;
    const receipt = await orderMaterialOnChain(materialId, quantity, manufacturerWallet);
    res.status(200).json({ message: 'Material ordered on blockchain', receipt });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getManufacturerStats = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const totalPartsProduced = await Part.countDocuments({ manufacturerWallet: walletAddress });
    const totalTransactions = await Transaction.countDocuments({ walletAddress });
    const partsShipped = await Part.countDocuments({ manufacturerWallet: walletAddress, status: "Shipped" });
    
    const materials = await Material.find({ manufacturerWallet: walletAddress });
    const materialsReceived = materials.reduce((sum, m) => sum + (m.quantityReceived || 0), 0);
    
    const totalOrdersReceived = await Order.countDocuments({ manufacturerWallet: walletAddress });

    res.status(200).json({
      totalPartsProduced,
      totalTransactions,
      partsShipped,
      materialsReceived,
      totalOrdersReceived
    });
  } catch (error) {
    console.error("Error in getManufacturerStats:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
exports.createProduction = async (req, res) => {
  try {
    const { partName, quantity, materialUsed, manufacturerWallet } = req.body;
    const result = await recordPartProduction({ partName, quantity, materialUsed, fromAddress: manufacturerWallet });
    res.status(200).json({ message: 'Part production recorded', tx: result.transactionHash });
  } catch (err) {
    res.status(500).json({ error: 'Blockchain error', reason: err.message });
  }
};

exports.performQA = async (req, res) => {
  try {
    const { partName, passed, manufacturerWallet } = req.body;
    const result = await performQualityCheck({ partName, passed, fromAddress: manufacturerWallet });
    res.status(200).json({ message: 'QA status updated', tx: result.transactionHash });
  } catch (err) {
    res.status(500).json({ error: 'QA error', reason: err.message });
  }
};

exports.createShipment = async (req, res) => {
  try {
    const { partName, quantity, toAddress, manufacturerWallet } = req.body;
    const result = await shipParts({ partName, quantity, toAddress, fromAddress: manufacturerWallet });
    res.status(200).json({ message: 'Shipment sent', tx: result.transactionHash });
  } catch (err) {
    res.status(500).json({ error: 'Shipment error', reason: err.message });
  }
};
