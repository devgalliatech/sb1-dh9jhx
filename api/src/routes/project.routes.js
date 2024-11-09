const express = require('express');
const { body } = require('express-validator');
const projectController = require('../controllers/project.controller');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, [
  body('title').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('goalAmount').isFloat({ min: 0 }),
  body('endDate').isISO8601(),
  body('category').isIn(['Technology', 'Art', 'Music', 'Film', 'Games', 'Publishing', 'Social'])
], projectController.createProject);

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProject);
router.put('/:id', auth, projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;