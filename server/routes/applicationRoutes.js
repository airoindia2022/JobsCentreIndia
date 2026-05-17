const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Application = require('../models/Application');
const Job = require('../models/Job');

// @route    POST api/applications
// @desc     Apply for a job
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'seeker') {
    return res.status(403).json({ msg: 'Only job seekers can apply for jobs' });
  }

  const { jobId, resume, resumeFile, resumeFileName, coverLetter, portfolio, linkedin, github, phone, availability } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Check if already applied
    const existingApplication = await Application.findOne({ job: jobId, applicant: req.user.id });
    if (existingApplication) {
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    const newApplication = new Application({
      job: jobId,
      applicant: req.user.id,
      resume,
      resumeFile,
      resumeFileName,
      coverLetter,
      portfolio,
      linkedin,
      github,
      phone,
      availability
    });

    const application = await newApplication.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/applications/me
// @desc     Get my applications (seeker)
router.get('/me', auth, async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id }).populate('job');
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/applications/job/:jobId
// @desc     Get applications for a specific job (provider)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const applications = await Application.find({ job: req.params.jobId }).populate('applicant', ['name', 'email']);
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/applications/provider
// @desc     Get all applications for provider's jobs
router.get('/provider', auth, async (req, res) => {
  try {
    const myJobs = await Job.find({ postedBy: req.user.id });
    const jobIds = myJobs.map(job => job._id);
    
    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', ['title', 'company'])
      .populate('applicant', ['name', 'email']);
    
    res.json(applications);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PATCH api/applications/:id
// @desc     Update application status
router.patch('/:id', auth, async (req, res) => {
  const { status } = req.body;
  try {
    let application = await Application.findById(req.params.id).populate('job');
    if (!application) return res.status(404).json({ msg: 'Application not found' });

    // Check if user is the provider who posted the job
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
