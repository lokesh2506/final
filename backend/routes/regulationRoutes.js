const express = require('express');
const router = express.Router();
const regulationController = require('../controllers/regulationController');

router.get('/', regulationController.getRegulations);

module.exports = router;