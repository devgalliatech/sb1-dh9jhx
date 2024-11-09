const Project = require('../models/Project');
const Contribution = require('../models/Contribution');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

exports.getCreatorProjects = async (req, res) => {
  try {
    const projects = await Project.find({ creator: req.user._id })
      .sort({ createdAt: -1 });

    const projectsWithStats = await Promise.all(projects.map(async (project) => {
      const stats = await getProjectStatistics(project._id);
      return {
        ...project.toObject(),
        stats
      };
    }));

    res.json(projectsWithStats);
  } catch (error) {
    console.error('Erreur getCreatorProjects:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des projets' });
  }
};

exports.getProjectStats = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      creator: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const stats = await getProjectStatistics(project._id);
    res.json(stats);
  } catch (error) {
    console.error('Erreur getProjectStats:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};

exports.getProjectContributions = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      creator: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const contributions = await Contribution.find({ project: project._id })
      .populate('contributor', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    console.error('Erreur getProjectContributions:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des contributions' });
  }
};

exports.getProjectComments = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      creator: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Projet non trouvé' });
    }

    const comments = await Comment.find({ project: project._id })
      .populate('user', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error('Erreur getProjectComments:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des commentaires' });
  }
};

async function getProjectStatistics(projectId) {
  try {
    const [
      totalContributions,
      uniqueContributors,
      recentContributions,
      commentsCount
    ] = await Promise.all([
      Contribution.aggregate([
        { $match: { 
          project: new mongoose.Types.ObjectId(projectId), 
          status: 'completed' 
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Contribution.distinct('contributor', { 
        project: projectId, 
        status: 'completed' 
      }),
      Contribution.find({ project: projectId, status: 'completed' })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('contributor', 'firstName lastName'),
      Comment.countDocuments({ project: projectId })
    ]);

    return {
      totalRaised: totalContributions[0]?.total || 0,
      contributorsCount: uniqueContributors.length,
      recentContributions,
      commentsCount
    };
  } catch (error) {
    console.error('Erreur getProjectStatistics:', error);
    throw error;
  }
}