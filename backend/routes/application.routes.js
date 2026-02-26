const express = require('express');
const { 
  applyToJob, 
  getMyApplications, 
  getJobApplications, 
  updateApplicationStatus 
} = require('../controllers/application.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isSeeker, isRecruiter } = require('../middleware/role.middleware');
const router = express.Router();

// Job Seeker routes
router.post('/apply/:jobId', verifyToken, isSeeker, applyToJob);
router.get('/my-applications', verifyToken, isSeeker, getMyApplications);

// Recruiter routes
router.get('/job/:jobId', verifyToken, isRecruiter, getJobApplications);
router.put('/:applicationId/status', verifyToken, isRecruiter, updateApplicationStatus);

module.exports = router;