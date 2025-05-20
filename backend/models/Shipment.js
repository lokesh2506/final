const mongoose = require('mongoose');
const shipmentSchema = new mongoose.Schema({
  from: String,
  to: String,
  itemType: String, // "part" or "material"
  itemName: String,
  quantity: Number,
  shipmentDate: { type: Date, default: Date.now },
  status: { type: String, default: 'shipped' }
});
module.exports = mongoose.model('Shipment', shipmentSchema);
