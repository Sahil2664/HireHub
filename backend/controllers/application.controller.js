const Application = require('../models/Application.model');
const Job = require('../models/Job.model');

// Apply to a job (Job Seeker only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Create application
    const application = await Application.create({
      job: jobId,
      applicant: req.user.id,
      coverLetter
    });

    // Add application to job's applications array
    job.applications.push(application._id);
    await job.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications by logged-in job seeker
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('job', 'title company location salary jobType')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all applications for a specific job (Recruiter only)
exports.getJobApplications = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to the recruiter
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only view applications for your own jobs' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email profile')
      .sort({ createdAt: -1 });

    res.status(200).json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (Recruiter only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const application = await Application.findById(applicationId).populate('job');
    
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if recruiter owns the job
    if (application.job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only update applications for your own jobs' });
    }

    application.status = status;
    await application.save();

    res.status(200).json({
      message: 'Application status updated',
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};