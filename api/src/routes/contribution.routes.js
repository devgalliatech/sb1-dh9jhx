const express = require('express');
const { body } = require('express-validator');
const contributionController = require('../controllers/contribution.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:projectId', auth, [
  body('amount').isFloat({ min: 1 }),
  body('message').optional().trim()
], contributionController.createContribution);

router.get('/project/:projectId', contributionController.getProjectContributions);
router.get('/user', auth, contributionController.getUserContributions);

module.exports = router;