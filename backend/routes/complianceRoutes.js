const express = require('express');
const router = express.Router();
const complianceController = require('../controllers/complianceController');

router.get('/', complianceController.getCompliance);

module.exports = router;