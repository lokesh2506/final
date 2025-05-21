const Admin = artifacts.require("Admin");
const Transaction = artifacts.require("Transaction");
const Fine = artifacts.require("Fine");
const Supplier = artifacts.require("Supplier");
const Manufacturer = artifacts.require("Manufacturer");
const MRO = artifacts.require("MRO");
const Airline = artifacts.require("Airline");
const RegulatoryAuthority = artifacts.require("RegulatoryAuthority");
const Utils = artifacts.require("Utils");
const PartProduction = artifacts.require("PartProduction");
module.exports = async function (deployer) {
  console.log("🚀 Deploying Admin...");
  await deployer.deploy(Admin);
  const admin = await Admin.deployed();

  console.log("📦 Deploying Transaction...");
  await deployer.deploy(Transaction);
  const transaction = await Transaction.deployed();
  deployer.deploy(PartProduction);
  console.log("💰 Deploying Fine...");
  await deployer.deploy(Fine);
  const fine = await Fine.deployed();

  console.log("🧮 Deploying Utils...");
  await deployer.deploy(Utils);
  const utils = await Utils.deployed();

  console.log("📦 Deploying Supplier...");
  await deployer.deploy(Supplier, admin.address, transaction.address);
  const supplier = await Supplier.deployed();

  console.log("🏭 Deploying Manufacturer...");
  await deployer.deploy(Manufacturer, admin.address, supplier.address, transaction.address);
  const manufacturer = await Manufacturer.deployed();

  console.log("🔧 Deploying MRO...");
  await deployer.deploy(MRO, admin.address, fine.address);
  const mro = await MRO.deployed();

  console.log("🛫 Deploying Airline...");
  await deployer.deploy(Airline, admin.address, transaction.address, fine.address);
  const airline = await Airline.deployed();

  console.log("📜 Deploying Regulatory Authority...");
  await deployer.deploy(RegulatoryAuthority, admin.address, transaction.address, fine.address);
  const regulatoryauthority = await RegulatoryAuthority.deployed();

  console.log("✅ All contracts deployed successfully!");
  console.log("✅ Admin:", admin.address);
  console.log("✅ Supplier:", supplier.address);
  
};
