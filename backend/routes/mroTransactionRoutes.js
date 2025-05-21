const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/mrotransaction');

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);

module.exports = router;