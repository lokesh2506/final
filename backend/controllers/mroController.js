const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
  const order = new Order(req.body);
  await order.save();
  res.status(201).json({ message: 'Order placed', order });
};

exports.getOrdersByMRO = async (req, res) => {
  const orders = await Order.find({ mroWallet: req.params.wallet });
  res.json(orders);
};