const express = require('express');
const router = express.Router();
const partRequestController = require('../controllers/partRequestController');

router.get('/', partRequestController.getPartRequests);
router.post('/', partRequestController.createPartRequest);

module.exports = router;