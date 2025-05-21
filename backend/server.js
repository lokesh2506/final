const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ROUTES
const verificationRoutes = require('./routes/verification');
const materialRoutes = require('./routes/material');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes');
const VerificationRequest = require('./models/VerificationRequest');
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api/parts', require('./routes/partRoutes'));
app.use('/api/verification', verificationRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/manufacturer', manufacturerRoutes); 
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use('/api/service-orders', require('./routes/serviceOrderRoutes'));
app.use('/api/part-requests', require('./routes/partRequestRoutes'));
app.use('/api/mrotransactions', require('./routes/mroTransactionRoutes'));
app.use('/api/audits', require('./routes/auditRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes')); 

// Verified users route
app.get('/api/verification/verified', async (req, res) => {
  try {
    const verifiedUsers = await VerificationRequest.find({ status: 'approved' })
      .select('walletAddress role updatedAt');
    res.json(verifiedUsers);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Failed to fetch verified users' });
  }
});
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
