const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controllers/comment.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/:projectId', auth, [
  body('content').trim().notEmpty(),
  body('parentComment').optional().isMongoId()
], commentController.createComment);

router.get('/project/:projectId', commentController.getProjectComments);
router.put('/:commentId', auth, commentController.updateComment);
router.delete('/:commentId', auth, commentController.deleteComment);

module.exports = router;