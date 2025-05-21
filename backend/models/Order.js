const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  supplier: String,
  manufacturer: String,
  mroWallet: String,
  materialName: String,
  materialId: String,
  partName: String,
  quantity: Number,
  contractOrderId:Number,
  totalPrice: Number,
  requiredDeliveryDate: Date,
  actualDeliveryDate: Date,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Order', orderSchema);

