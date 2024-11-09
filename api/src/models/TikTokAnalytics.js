const mongoose = require('mongoose');

const tikTokAnalyticsSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  videoPerformance: [{
    videoId: String,
    views: Number,
    likes: Number,
    shares: Number,
    comments: Number,
    clickthroughRate: Number,
    conversionRate: Number
  }],
  totalEngagement: {
    views: Number,
    likes: Number,
    shares: Number,
    comments: Number
  },
  contributionImpact: {
    totalContributions: Number,
    contributionsFromTikTok: Number,
    conversionRate: Number
  },
  hashtagPerformance: [{
    hashtag: String,
    reach: Number,
    engagement: Number
  }]
}, {
  timestamps: true
});

const TikTokAnalytics = mongoose.model('TikTokAnalytics', tikTokAnalyticsSchema);

module.exports = TikTokAnalytics;