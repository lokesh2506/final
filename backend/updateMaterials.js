const mongoose = require('mongoose');
const Material = require('../models/material.js');

mongoose.connect('mongodb://localhost:27017/supplychain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    Material.updateMany({}, { $set: { supplierWallet: '0x90be4AcD790b7CDBbFe1A85ecbe5f17f3Df61' } })
      .then(() => {
        console.log('Updated supplierWallet for all materials');
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
  });