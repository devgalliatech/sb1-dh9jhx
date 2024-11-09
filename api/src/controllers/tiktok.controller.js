const TikTokAccount = require('../models/TikTokAccount');
const tiktokConfig = require('../config/tiktok');

exports.getAuthUrl = async (req, res) => {
  try {
    const authUrl = tiktokConfig.getAuthUrl();
    res.json({ authUrl });
  } catch (error) {
    console.error('Erreur getAuthUrl:', error);
    res.status(500).json({ message: 'Erreur lors de la génération de l\'URL d\'authentification' });
  }
};

exports.handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const tokenData = await tiktokConfig.getAccessToken(code);

    const tikTokAccount = new TikTokAccount({
      user: req.user._id,
      tiktokId: tokenData.open_id,
      username: tokenData.username,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
    });

    await tikTokAccount.save();
    res.json({ message: 'Compte TikTok connecté avec succès' });
  } catch (error) {
    console.error('Erreur handleCallback:', error);
    res.status(500).json({ message: 'Erreur lors de la connexion du compte TikTok' });
  }
};

exports.shareProject = async (req, res) => {
  try {
    // Pour le moment, on renvoie juste un message de succès
    res.json({ message: 'Fonctionnalité en cours de développement' });
  } catch (error) {
    console.error('Erreur shareProject:', error);
    res.status(500).json({ message: 'Erreur lors du partage du projet' });
  }
};

exports.getAccountInfo = async (req, res) => {
  try {
    const account = await TikTokAccount.findOne({ user: req.user._id });
    if (!account) {
      return res.status(404).json({ message: 'Compte TikTok non trouvé' });
    }
    res.json(account);
  } catch (error) {
    console.error('Erreur getAccountInfo:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des informations du compte' });
  }
};

exports.disconnectAccount = async (req, res) => {
  try {
    await TikTokAccount.findOneAndDelete({ user: req.user._id });
    res.json({ message: 'Compte TikTok déconnecté avec succès' });
  } catch (error) {
    console.error('Erreur disconnectAccount:', error);
    res.status(500).json({ message: 'Erreur lors de la déconnexion du compte' });
  }
};

// Fonctions temporaires pour les nouvelles fonctionnalités
exports.configureAutoUpdates = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};

exports.createMilestoneVideo = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};

exports.createProjectChallenge = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};

exports.getTikTokAnalytics = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};

exports.scheduleContent = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};

exports.getTrendingHashtags = async (req, res) => {
  res.json({ message: 'Fonctionnalité en cours de développement' });
};