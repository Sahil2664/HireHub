const Job = require('../models/Job.model');

// Create new job (Recruiter only)
exports.createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary, jobType } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      jobType,
      postedBy: req.user.id
    });

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all jobs
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate('postedBy', 'name email company').sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email company');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete job (Recruiter only - own jobs)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if the recruiter owns this job
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get jobs posted by logged-in recruiter
exports.getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};