// ...existing requires
const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.BLOCKCHAIN_URL || 'http://127.0.0.1:7545');

// Confirm Web3 connection
web3.eth.net.isListening()
  .then(() => console.log('✅ Web3 connected to Ganache'))
  .catch(err => console.error('❌ Web3 connection error:', err));

// ABIs
const AdminABI = require('../../build/contracts/Admin.json');
const ManufacturerABI = require('../../build/contracts/Manufacturer.json');
const SupplierABI = require('../../build/contracts/Supplier.json');
const Transaction = require('../models/Transaction');

// Validate .env
const validateEnvAddresses = () => {
  const required = ['ADMIN_ADDRESS', 'MANUFACTURER_ADDRESS', 'SUPPLIER_ADDRESS'];
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
    if (!web3.utils.isAddress(process.env[key])) throw new Error(`Invalid Ethereum address in .env: ${key}`);
  }
};

// Init contracts
const initContracts = async () => {
  validateEnvAddresses();

  const admin = new web3.eth.Contract(AdminABI.abi, web3.utils.toChecksumAddress(process.env.ADMIN_ADDRESS));
  const manufacturer = new web3.eth.Contract(ManufacturerABI.abi, web3.utils.toChecksumAddress(process.env.MANUFACTURER_ADDRESS));
  const supplier = new web3.eth.Contract(SupplierABI.abi, web3.utils.toChecksumAddress(process.env.SUPPLIER_ADDRESS));

  console.log("✅ All smart contracts initialized");
  return { admin, manufacturer, supplier };
};

// ✅ Existing: Add Material
const addMaterialOnChain = async ({ name, details, quantity, serialNumber, batchNumber, certification, certifiedAuthority, pricePerKg, fromAddress }) => {
  const { supplier } = await initContracts();

  const tx = await supplier.methods.addMaterial(name, details, quantity, serialNumber, batchNumber, certification, certifiedAuthority, pricePerKg).send({
    from: web3.utils.toChecksumAddress(fromAddress),
    value: web3.utils.toWei("0.01", "ether"),
    gas: 500000
  });

  return {
    success: true,
    transactionHash: tx.transactionHash,
    blockNumber: tx.blockNumber,
    gasUsed: tx.gasUsed
  };
};

// ✅ NEW: Admin verifies manufacturer
const verifyManufacturerOnChain = async (manufacturerWallet, fromAdmin) => {
  const { admin } = await initContracts();

  const tx = await admin.methods.verifyUser(manufacturerWallet, 1).send({
    from: web3.utils.toChecksumAddress(fromAdmin),
    gas: 200000
  });

  return {
    success: true,
    transactionHash: tx.transactionHash,
    role: "Manufacturer Verified"
  };
};

// ✅ Updated: Manufacturer places order (with ETH and verification)
const placeOrderOnChain = async ({ materialName, quantity, pricePerKg, supplierAddress, manufacturerAddress }) => {
  const { manufacturer, admin } = await initContracts();

  const isVerified = await admin.methods.isVerified(manufacturerAddress, 1).call();
  if (!isVerified) throw new Error("Manufacturer is not verified by Admin.");

  const totalPrice = quantity * pricePerKg;
  const tx = await manufacturer.methods.placeOrder(materialName, quantity, supplierAddress, pricePerKg).send({
    from: web3.utils.toChecksumAddress(manufacturerAddress),
    value: web3.utils.toWei(totalPrice.toString(), "ether"),
    gas: 600000
  });

  await Transaction.create({
    role: 'Manufacturer',
    wallet: manufacturerAddress,
    action: `Ordered ${materialName} x${quantity} from Supplier`,
    timestamp: new Date(),
  });

  return {
    success: true,
    transactionHash: tx.transactionHash,
    blockNumber: tx.blockNumber,
    gasUsed: tx.gasUsed
  };
};

//
// ✅ Manufacturer-specific functions
//

// Record part production
const recordPartProduction = async ({ partName, quantity, materialUsed, fromAddress }) => {
  const { manufacturer } = await initContracts();

  const tx = await manufacturer.methods.recordProduction(partName, quantity, materialUsed).send({
    from: web3.utils.toChecksumAddress(fromAddress),
    gas: 500000
  });

  await Transaction.create({
    role: 'Manufacturer',
    wallet: fromAddress,
    action: `Produced part: ${partName} using ${materialUsed}`,
    timestamp: new Date()
  });

  return {
    success: true,
    transactionHash: tx.transactionHash
  };
};

// Perform QA Check
const performQualityCheck = async ({ partName, passed, fromAddress }) => {
  const { manufacturer } = await initContracts();

  const tx = await manufacturer.methods.performQA(partName, passed).send({
    from: web3.utils.toChecksumAddress(fromAddress),
    gas: 300000
  });

  await Transaction.create({
    role: 'Manufacturer',
    wallet: fromAddress,
    action: `QA ${passed ? 'approved' : 'rejected'} for part: ${partName}`,
    timestamp: new Date()
  });

  return {
    success: true,
    transactionHash: tx.transactionHash
  };
};

// Ship parts
const shipParts = async ({ partName, quantity, toAddress, fromAddress }) => {
  const { manufacturer } = await initContracts();

  const tx = await manufacturer.methods.shipPart(partName, quantity, toAddress).send({
    from: web3.utils.toChecksumAddress(fromAddress),
    gas: 400000
  });

  await Transaction.create({
    role: 'Manufacturer',
    wallet: fromAddress,
    action: `Shipped ${quantity} x ${partName} to ${toAddress.slice(0, 6)}...${toAddress.slice(-4)}`,
    timestamp: new Date()
  });
  await placeOrderOnChain({
    materialName: "Steel",  // optional lookup
    quantity,
    pricePerKg: totalPrice / quantity,
    supplierAddress: supplierWallet,
    manufacturerAddress: manufacturerWallet
  });

  return {
    success: true,
    transactionHash: tx.transactionHash
  };
};

module.exports = {
  initContracts,
  addMaterialOnChain,
  placeOrderOnChain,
  verifyManufacturerOnChain,   // ✅ NEW
  recordPartProduction,
  performQualityCheck,
  shipParts
};
