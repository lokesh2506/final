const express = require('express');
const router = express.Router();
const { addMaterial, searchMaterial } = require('../controllers/manufacturerController');
router.post('/add-material', addMaterial); 
router.get('/search-material', searchMaterial);
module.exports = router;