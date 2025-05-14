const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ethers } = require('ethers');
const app = express();
const verificationRoutes = require('./routes/verification');
const materialRoutes = require('./routes/material');
const orderRoutes = require('./routes/order');
const AdminABI = require('../src/abis/Admin.json'); // Adjust path to match your structure
const VerificationRequest = require('./models/VerificationRequest'); // Import the existing model

// Allow requests from both user app (port 3000) and admin dashboard (port 3001)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api/verification', verificationRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/order', orderRoutes);

// Existing endpoint to fetch verified users
app.get('/api/verification/verified', async (req, res) => {
  try {
    const verifiedUsers = await VerificationRequest.find({ status: 'approved' }).select('walletAddress role updatedAt');
    res.json(verifiedUsers);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Failed to fetch verified users' });
  }
});

// Ethereum provider and contract setup
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:7545');
const adminContractAddress = '0x4A12E7Edcd9143c6f598EC3e934239FA5994123e';
const adminContract = new ethers.Contract(adminContractAddress, AdminABI.abi, provider);

// Listen for VerificationRequested events
adminContract.on('VerificationRequested', async (entityAddress, role, event) => {
  console.log('VerificationRequested event:', { entityAddress, role });
  try {
    const request = new VerificationRequest({
      walletAddress: entityAddress,
      role: role,
      status: 'pending',
    });
    await request.save();
    console.log('Verification request saved to database:', request);
  } catch (error) {
    console.error('Error saving verification request:', error);
  }
});

// Listen for VerificationUpdated events
adminContract.on('VerificationUpdated', async (entityAddress, role, status, event) => {
  console.log('VerificationUpdated event:', { entityAddress, role, status: Number(status) });
  try {
    const newStatus = Number(status) === 1 ? 'approved' : 'rejected';
    await VerificationRequest.updateOne(
      { walletAddress: entityAddress, role: role },
      { status: newStatus, updatedAt: new Date() }
    );
    console.log(`Updated verification request for ${entityAddress} with role ${role} to status ${newStatus}`);
  } catch (error) {
    console.error('Error updating verification request:', error);
  }
});

// Existing MongoDB connection
mongoose.connect('mongodb://localhost:27017/supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Existing server start
app.listen(5000, () => console.log('Server running on port 5000'));