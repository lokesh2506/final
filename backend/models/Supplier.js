const mongoose = require("mongoose");
const supplierSchema = new mongoose.Schema({
  name: String,
  address: String,
  materials: [String],
  ethereumAddress: String,
  transactions: [Object],
});

module.exports = mongoose.model("Supplier", supplierSchema);
