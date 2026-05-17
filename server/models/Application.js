const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'shortlisted', 'hired'],
    default: 'pending'
  },
  resume: String,
  resumeFile: String,
  resumeFileName: String,
  coverLetter: String,
  portfolio: String,
  linkedin: String,
  github: String,
  phone: String,
  availability: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Application', applicationSchema);
