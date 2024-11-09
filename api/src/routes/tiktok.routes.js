const express = require('express');
const tiktokController = require('../controllers/tiktok.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/auth', auth, tiktokController.getAuthUrl);
router.get('/callback', tiktokController.handleCallback);
router.post('/share-project/:projectId', auth, tiktokController.shareProject);
router.get('/account', auth, tiktokController.getAccountInfo);
router.delete('/disconnect', auth, tiktokController.disconnectAccount);

// Nouvelles routes
router.post('/projects/:projectId/auto-updates', auth, tiktokController.configureAutoUpdates);
router.post('/projects/:projectId/milestone-video', auth, tiktokController.createMilestoneVideo);
router.post('/projects/:projectId/challenge', auth, tiktokController.createProjectChallenge);
router.get('/projects/:projectId/analytics', auth, tiktokController.getTikTokAnalytics);
router.post('/projects/:projectId/schedule', auth, tiktokController.scheduleContent);
router.get('/trending-hashtags', auth, tiktokController.getTrendingHashtags);

module.exports = router;