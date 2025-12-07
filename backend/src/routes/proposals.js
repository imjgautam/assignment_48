const express = require('express');
const router = express.Router();
const proposalController = require('../controllers/proposalController');

// Simulate vendor proposal
router.post('/simulate', proposalController.simulateProposal);

// Get proposals for an RFP
router.get('/rfp/:rfpId', proposalController.getProposalsForRfp);

// Compare proposals for an RFP
router.get('/compare/:rfpId', proposalController.compareProposals);

module.exports = router;
