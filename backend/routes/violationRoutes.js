const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');

router.get('/', violationController.getViolations);

module.exports = router;