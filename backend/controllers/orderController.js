const { initContracts } = require("../utils/blockchain"); 

exports.getOrderStatus = async (req, res) => {
  try {
    const { order } = await initContracts(); 
    const orderId = parseInt(req.params.orderId); 
    if (isNaN(orderId)) {
      return res.status(400).json({ error: "Invalid orderId" });
    }
    const orderDetails = await order.methods.getOrder(orderId).call();
    const status = orderDetails.fulfilled ? "Fulfilled" : "Pending";
    res.json({ orderId, status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { materialId, quantity, manufacturerWallet, supplierWallet, totalPrice } = req.body;
    await orderMaterialOnChain(materialId, quantity, manufacturerWallet);
    res.status(201).json({ message: "Order created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};