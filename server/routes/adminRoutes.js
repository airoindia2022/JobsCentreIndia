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

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt');
    const recentJobs = await Job.find().sort({ createdAt: -1 }).limit(5).select('title company createdAt status');

    res.json({
      success: true,
      stats: { totalUsers, totalJobs, activeJobs, totalApplications },
      recentActivity: { users: recentUsers, jobs: recentJobs }
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

// Delete a single user
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    // Also delete their applications
    await Application.deleteMany({ applicant: req.params.id });
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Server error deleting user' });
  }
});

// Delete ALL users (and their applications)
router.delete('/users', async (req, res) => {
  try {
    await Application.deleteMany({});
    await User.deleteMany({});
    res.json({ success: true, message: 'All users and applications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all users:', error);
    res.status(500).json({ success: false, message: 'Server error deleting all users' });
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

// Delete a single job
router.delete('/jobs/:id', async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    // Also delete applications for this job
    await Application.deleteMany({ job: req.params.id });
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, message: 'Server error deleting job' });
  }
});

// Delete ALL jobs (and their applications)
router.delete('/jobs', async (req, res) => {
  try {
    await Application.deleteMany({});
    await Job.deleteMany({});
    res.json({ success: true, message: 'All jobs and applications deleted successfully' });
  } catch (error) {
    console.error('Error deleting all jobs:', error);
    res.status(500).json({ success: false, message: 'Server error deleting all jobs' });
  }
});

// Nuclear option: Delete ALL data
router.delete('/all-data', async (req, res) => {
  try {
    await Application.deleteMany({});
    await Job.deleteMany({});
    await User.deleteMany({});
    res.json({ success: true, message: 'All data wiped successfully' });
  } catch (error) {
    console.error('Error wiping all data:', error);
    res.status(500).json({ success: false, message: 'Server error wiping all data' });
  }
});

module.exports = router;
