const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3('http://127.0.0.1:7545');
web3.eth.net.isListening()
  .then(() => console.log('Web3 is connected to Ganache'))
  .catch(err => console.error('Web3 connection error:', err));

const AdminABI = require('../../build/contracts/Admin.json').abi;
const ManufacturerABI = require('../../build/contracts/Manufacturer.json').abi;
const SupplierABI = require('../../build/contracts/Supplier.json').abi;
const OrderABI = require('../../build/contracts/Order.json').abi;

const initContracts = async () => {
  try {
    const admin = new web3.eth.Contract(AdminABI, process.env.ADMIN_ADDRESS);
    const manufacturer = new web3.eth.Contract(ManufacturerABI, process.env.MANUFACTURER_ADDRESS);
    const supplier = new web3.eth.Contract(SupplierABI, process.env.SUPPLIER_ADDRESS);
    const order = new web3.eth.Contract(OrderABI, process.env.ORDER_ADDRESS);
    return { admin, manufacturer, supplier, order };
  } catch (error) {
    throw new Error('Failed to initialize contracts: ' + error.message);
  }
};
const orderMaterialOnChain = async (materialId, quantity, manufacturerWallet) => {
  const { order } = await initContracts();
  const accounts = await web3.eth.getAccounts();
  await order.methods.createOrder(manufacturerWallet, process.env.SUPPLIER_ADDRESS, materialId, quantity)
    .send({ from: accounts[0] });
};
module.exports = { initContracts };