const express = require('express');
const notificationController = require('../controllers/notification.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, notificationController.getUserNotifications);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.put('/read-all', auth, notificationController.markAllAsRead);

module.exports = router;