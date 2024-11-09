const Notification = require('../models/Notification');

const createNotification = async ({
  recipient,
  type,
  title,
  message,
  relatedProject,
  relatedContribution
}) => {
  try {
    const notification = new Notification({
      recipient,
      type,
      title,
      message,
      relatedProject,
      relatedContribution
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error);
    throw error;
  }
};

module.exports = createNotification;