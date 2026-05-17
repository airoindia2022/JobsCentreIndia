const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Job = require('../models/Job');

// @route    POST api/jobs
// @desc     Create a job posting
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'provider') {
    return res.status(403).json({ msg: 'Only job providers can post jobs' });
  }

  const { title, company, location, salary, type, description, requirements, companyDescription, companyLogo, benefits } = req.body;

  try {
    const newJob = new Job({
      title,
      company,
      location,
      salary,
      type,
      description,
      requirements,
      companyDescription,
      companyLogo,
      benefits,
      postedBy: req.user.id
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/jobs/myjobs
// @desc     Get jobs posted by the authenticated provider
router.get('/myjobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/jobs
// @desc     Get all jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/jobs/:id
// @desc     Update a job
router.put('/:id', auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Check user
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    const { title, company, location, salary, type, description, requirements, companyDescription, companyLogo, benefits } = req.body;
    
    const updatedJob = {
      title,
      company,
      location,
      salary,
      type,
      description,
      requirements,
      companyDescription,
      companyLogo,
      benefits
    };

    job = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: updatedJob },
      { new: true }
    );

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/jobs/:id
// @desc     Get job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/jobs/:id
// @desc     Delete a job
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ msg: 'Job not found' });

    // Check user
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await job.deleteOne();
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
