const express = require('express');
const dashboardController = require('../controllers/dashboard.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/projects', auth, dashboardController.getCreatorProjects);
router.get('/projects/:projectId/stats', auth, dashboardController.getProjectStats);
router.get('/projects/:projectId/contributions', auth, dashboardController.getProjectContributions);
router.get('/projects/:projectId/comments', auth, dashboardController.getProjectComments);

module.exports = router;