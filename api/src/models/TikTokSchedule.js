const mongoose = require('mongoose');

const tikTokScheduleSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  scheduledDate: Date,
  contentType: {
    type: String,
    enum: ['update', 'milestone', 'challenge', 'reminder'],
    required: true
  },
  template: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'failed'],
    default: 'pending'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'milestone'],
    default: 'milestone'
  },
  milestoneThresholds: [{
    type: Number
  }]
}, {
  timestamps: true
});

const TikTokSchedule = mongoose.model('TikTokSchedule', tikTokScheduleSchema);

module.exports = TikTokSchedule;