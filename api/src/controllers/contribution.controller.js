const { validationResult } = require('express-validator');
const Contribution = require('../models/Contribution');
const Project = require('../models/Project');
const createNotification = require('../utils/createNotification');

exports.createContribution = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, message } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    // En mode test, on crée directement la contribution sans Stripe
    const contribution = new Contribution({
      project: project._id,
      contributor: req.user._id,
      amount,
      message,
      status: 'completed' // Pour les tests, on considère la contribution comme complétée
    });

    await contribution.save();

    // Mise à jour du montant total du projet
    project.currentAmount += amount;
    await project.save();

    // Notification au créateur du projet
    await createNotification({
      recipient: project.creator,
      type: 'contribution',
      title: 'Nouvelle contribution',
      message: `${req.user.firstName} a contribué ${amount}€ à votre projet`,
      relatedProject: project._id,
      relatedContribution: contribution._id
    });

    // En mode test, on renvoie directement la contribution
    res.status(201).json({
      contribution,
      testMode: true
    });
  } catch (error) {
    console.error('Erreur création contribution:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la contribution' });
  }
};

exports.getProjectContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ project: req.params.projectId })
      .populate('contributor', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    console.error('Erreur récupération contributions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contributions' });
  }
};

exports.getUserContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find({ contributor: req.user._id })
      .populate('project', 'title')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    console.error('Erreur récupération contributions utilisateur:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contributions' });
  }
};