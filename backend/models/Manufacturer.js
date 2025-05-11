const mongoose = require("mongoose");

const manufacturerSchema = new mongoose.Schema({
  name: String,
  products: [String],
  ethereumAddress: String,
  materialInventory: [Object],
  transactionHistory: [Object],
});

module.exports = mongoose.model("Manufacturer", manufacturerSchema);
