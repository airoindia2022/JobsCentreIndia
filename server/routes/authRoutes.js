const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route    POST api/auth/register
// @desc     Register user
router.post('/register', async (req, res) => {
  const { name, email, password, role, companyName, companyDescription, website, location } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password, role });

    if (role === 'provider') {
      user.profile = {
        companyName,
        companyDescription,
        website,
        location
      };
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, profile: user.profile } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    POST api/auth/login
// @desc     Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, profile: user.profile } });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET api/auth/user
// @desc     Get user data
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/auth/profile
// @desc     Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio, skills, experience, education, companyName, companyDescription, companyLogo, website, location, phone, resumeLink, resumeFile, resumeFileName, profileImg, projects, portfolio } = req.body;
    let user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    
    // Ensure profile object exists
    if (!user.profile) {
      user.profile = {};
    }

    // Update profile fields
    if (bio !== undefined) user.profile.bio = bio;
    if (skills !== undefined) user.profile.skills = skills;
    if (experience !== undefined) user.profile.experience = experience;
    if (education !== undefined) user.profile.education = education;
    if (companyName !== undefined) user.profile.companyName = companyName;
    if (companyDescription !== undefined) user.profile.companyDescription = companyDescription;
    if (companyLogo !== undefined) user.profile.companyLogo = companyLogo;
    if (website !== undefined) user.profile.website = website;
    if (location !== undefined) user.profile.location = location;
    if (phone !== undefined) user.profile.phone = phone;
    if (resumeLink !== undefined) user.profile.resumeLink = resumeLink;
    if (resumeFile !== undefined) user.profile.resumeFile = resumeFile;
    if (resumeFileName !== undefined) user.profile.resumeFileName = resumeFileName;
    if (profileImg !== undefined) user.profile.profileImg = profileImg;
    if (projects !== undefined) user.profile.projects = projects;
    if (portfolio !== undefined) user.profile.portfolio = portfolio;

    await user.save();
    
    // Send back user data without password
    const userWithoutPassword = await User.findById(req.user.id).select('-password');
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
