const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/certificationController');

router.get('/', certificationController.getCertifications);

module.exports = router;