const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Project = require('../models/Project');
const createNotification = require('../utils/createNotification');

exports.createComment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const comment = new Comment({
      project: project._id,
      user: req.user._id,
      content: req.body.content,
      parentComment: req.body.parentComment
    });

    await comment.save();

    // Notification au créateur du projet
    if (project.creator.toString() !== req.user._id.toString()) {
      await createNotification({
        recipient: project.creator,
        type: 'comment',
        title: 'Nouveau commentaire',
        message: `${req.user.firstName} a commenté votre projet`,
        relatedProject: project._id
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
  }
};

exports.getProjectComments = async (req, res) => {
  try {
    const comments = await Comment.find({ project: req.params.projectId })
      .populate('user', 'firstName lastName')
      .populate('parentComment')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    comment.content = req.body.content;
    await comment.save();

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du commentaire' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    
    if (!comment) {
      return res.status(404).json({ message: 'Commentaire non trouvé' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await comment.remove();
    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du commentaire' });
  }
};