const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
   role: {
    type: String,
    enum: ['seeker', 'provider', 'admin'],
    default: 'seeker'
  },
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    education: String,
    companyName: String,
    companyDescription: String,
    companyLogo: String,
    website: String,
    location: String,
    phone: String,
    resumeLink: String,
    resumeFile: String,
    resumeFileName: String,
    profileImg: String,
    projects: [{
      name: String,
      link: String,
      description: String
    }],
    portfolio: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
