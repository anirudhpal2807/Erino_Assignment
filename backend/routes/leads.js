const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadStats
} = require('../controllers/leadController');
const {
  validateLeadCreation,
  validateLeadUpdate,
  validateLeadQuery
} = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Lead routes
router.post('/', validateLeadCreation, createLead);
router.get('/', validateLeadQuery, getLeads);
router.get('/stats', getLeadStats);
router.get('/:id', getLead);
router.put('/:id', validateLeadUpdate, updateLead);
router.delete('/:id', deleteLead);

module.exports = router;
