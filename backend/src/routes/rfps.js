const express = require('express');
const router = express.Router();
const rfpController = require('../controllers/rfpController');

// Get all RFPs
router.get('/', rfpController.getAllRfps);

// Get single RFP
router.get('/:id', rfpController.getRfpById);

// Create RFP from Natural Language
router.post('/generate', rfpController.createRfpFromNlp);

// Send RFP to vendors
router.post('/:id/send', rfpController.sendRfpToVendors);

module.exports = router;
