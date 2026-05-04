const axios = require('axios');
const FormData = require('form-data');

const ML_SERVICE_URL = 'http://localhost:8000';

// Parse uploaded resume
exports.parseResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create form data
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: 'application/pdf'
    });

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/parse-resume`, formData, {
      headers: formData.getHeaders()
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('ML Service Error:', error.message);
    res.status(500).json({ message: 'Failed to parse resume' });
  }
};

// Get job recommendations with match scores
exports.getRecommendedJobs = async (req, res) => {
  try {
    const Job = require('../models/Job.model');
    const User = require('../models/User.model');

    // Get user profile
    const user = await User.findById(req.user.id);
    if (!user || !user.profile) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    // Create resume text from user profile
    const resumeText = `
      ${user.name}
      Skills: ${user.profile.skills?.join(', ') || ''}
      Bio: ${user.profile.bio || ''}
    `;

    // Get all jobs
    const jobs = await Job.find().lean();

    if (jobs.length === 0) {
      return res.status(200).json({ jobs: [] });
    }

    // Prepare jobs for ML service
    const jobsForML = jobs.map(job => ({
      _id: job._id.toString(),
      title: job.title,
      description: job.description,
      company: job.company,
      location: job.location,
      salary: job.salary,
      jobType: job.jobType,
      skills: [] // You can add skills field to Job model later
    }));

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/rank-jobs`, {
      resume_text: resumeText,
      jobs: jobsForML
    });

    res.status(200).json({
      jobs: response.data.ranked_jobs
    });
  } catch (error) {
    console.error('ML Service Error:', error.message);
    res.status(500).json({ message: 'Failed to get recommendations' });
  }
};

// Calculate match score for a specific job
exports.getJobMatchScore = async (req, res) => {
  try {
    const { jobId } = req.params;
    const Job = require('../models/Job.model');
    const User = require('../models/User.model');

    // Get user and job
    const user = await User.findById(req.user.id);
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create resume text
    const resumeText = `
      ${user.name}
      Skills: ${user.profile?.skills?.join(', ') || ''}
      Bio: ${user.profile?.bio || ''}
    `;

    const jobDescription = `${job.title} ${job.description} ${job.company}`;

    // Call ML service
    const response = await axios.post(`${ML_SERVICE_URL}/match-score`, {
      resume_text: resumeText,
      job_description: jobDescription
    });

    res.status(200).json({
      match_score: response.data.match_score
    });
  } catch (error) {
    console.error('ML Service Error:', error.message);
    res.status(500).json({ message: 'Failed to calculate match score' });
  }
};