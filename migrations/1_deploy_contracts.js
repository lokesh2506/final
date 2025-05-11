const Transaction = artifacts.require("Transaction");
const Admin = artifacts.require("Admin");
const Supplier = artifacts.require("Supplier");
const Manufacturer = artifacts.require("Manufacturer");

module.exports = async function (deployer) {
  // Deploy Transaction
  await deployer.deploy(Transaction);
  const transactionInstance = await Transaction.deployed();

  // Deploy Admin
  await deployer.deploy(Admin);
  const adminInstance = await Admin.deployed();

  // Deploy Supplier
  await deployer.deploy(Supplier, adminInstance.address, transactionInstance.address);
  const supplierInstance = await Supplier.deployed();

  // Deploy Manufacturer
  await deployer.deploy(Manufacturer, adminInstance.address, supplierInstance.address, transactionInstance.address);
};