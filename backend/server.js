const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// ROUTES
const verificationRoutes = require('./routes/verification');
const materialRoutes = require('./routes/material');
const orderRoutes = require('./routes/orderRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const manufacturerRoutes = require('./routes/manufacturerRoutes'); // ✅ Newly added
const VerificationRequest = require('./models/VerificationRequest');



// Mount routes
app.use('/api/verification', verificationRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/manufacturer', manufacturerRoutes); // ✅ Added here


const complianceRoutes = require('./routes/complianceRoutes');
const regulationRoutes = require('./routes/regulationRoutes');
const inspectionRoutes = require('./routes/inspectionRoutes');
const violationRoutes = require('./routes/violationRoutes');
const certificationRoutes = require('./routes/certificationRoutes');
const auditRoutes = require('./routes/auditRoutes');
const blockchainTransactionRoutes = require('./routes/blockchainTransactionRoutes');
const metricRoutes = require('./routes/metricRoutes');

app.use('/api/compliance', complianceRoutes);
app.use('/api/regulations', regulationRoutes);
app.use('/api/inspections', inspectionRoutes);
app.use('/api/violations', violationRoutes);
app.use('/api/certifications', certificationRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/blockchain-transactions', blockchainTransactionRoutes);
app.use('/api/metrics', metricRoutes);

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

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/Supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
