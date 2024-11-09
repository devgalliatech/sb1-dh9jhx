const createVideoTemplate = async (template, data) => {
  const templates = {
    projectUpdate: {
      title: `${data.projectTitle} - Mise à jour`,
      description: `Déjà ${data.currentAmount}€ collectés sur ${data.goalAmount}€ !`,
      musicId: 'default_music_1',
      effects: ['fadeIn', 'textOverlay']
    },
    milestone: {
      title: `${data.projectTitle} - ${data.milestone}`,
      description: `Nous avons atteint ${data.milestone} ! Merci à tous !`,
      musicId: 'celebration_music_1',
      effects: ['confetti', 'milestone_overlay']
    },
    dailyRecap: {
      title: `${data.projectTitle} - Récap du jour`,
      description: `Point quotidien sur notre campagne`,
      musicId: 'dynamic_music_1',
      effects: ['splitScreen', 'progressBar']
    }
  };

  return templates[template] || templates.projectUpdate;
};

module.exports = {
  createVideoTemplate
};