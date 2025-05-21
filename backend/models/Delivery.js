const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: Number,
  materialName: String,
  quantity: Number,
  supplier: String,                // Wallet of supplier
  manufacturer: String,            // Manufacturer address or ID
  status: { type: String, default: 'supplied' },
  deliveryDate: { type: Date, default: Date.now },
  trackingNumber: { type: String },
  material: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Material'              // Reference to the Material model
  }
});

module.exports = mongoose.model('Delivery', deliverySchema);
