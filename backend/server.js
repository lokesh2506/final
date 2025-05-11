const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const verificationRoutes = require('./routes/verification');
const materialRoutes = require('./routes/material');
const orderRoutes = require('./routes/order');

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
app.get('/api/verification/verified', async (req, res) => {
  try {
    const verifiedUsers = await VerificationRequest.find({ status: 'approved' }).select('walletAddress role updatedAt');
    res.json(verifiedUsers);
  } catch (error) {
    console.error('Error fetching verified users:', error);
    res.status(500).json({ error: 'Failed to fetch verified users' });
  }
});
mongoose.connect('mongodb://localhost:27017/supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));