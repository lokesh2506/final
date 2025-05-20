const mongoose = require('mongoose');
const inventorySchema = new mongoose.Schema({
  manufacturer: String,
  materialName: String,
  quantityReceived: Number,
  supplier: String,
  dateReceived: { type: Date, default: Date.now }
});
module.exports = mongoose.model('MaterialInventory', inventorySchema);

