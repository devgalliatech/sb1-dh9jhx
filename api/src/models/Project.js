const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  goalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  endDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Art', 'Music', 'Film', 'Games', 'Publishing', 'Social']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'funded', 'ended'],
    default: 'draft'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  images: [{
    type: String
  }]
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;