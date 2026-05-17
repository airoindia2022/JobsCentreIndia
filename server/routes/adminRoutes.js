const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalJobs = await Job.countDocuments({});
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const totalApplications = await Application.countDocuments({});
    
    // Optionally fetch recent activity
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).select('title company createdAt');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalJobs,
        activeJobs,
        totalApplications
      },
      recentActivity: {
        users: recentUsers,
        jobs: recentJobs
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching stats' });
  }
});

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Server error fetching users' });
  }
});

// Get all jobs
router.get('/jobs', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, message: 'Server error fetching jobs' });
  }
});

module.exports = router;
