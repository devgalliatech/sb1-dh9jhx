const mongoose = require('mongoose');

const tikTokAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tiktokId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  accessToken: String,
  refreshToken: String,
  tokenExpiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const TikTokAccount = mongoose.model('TikTokAccount', tikTokAccountSchema);

module.exports = TikTokAccount;