const express = require('express');
const router = express.Router();
const blockchainTransactionController = require('../controllers/blockchainTransactionController');

router.get('/', blockchainTransactionController.getBlockchainTransactions);

module.exports = router;