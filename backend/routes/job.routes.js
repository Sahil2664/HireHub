const express = require('express');
const { createJob, getAllJobs, getJobById, deleteJob, getMyJobs } = require('../controllers/job.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isRecruiter } = require('../middleware/role.middleware');
const router = express.Router();

// Public route
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes (Recruiter only)
router.post('/', verifyToken, isRecruiter, createJob);
router.delete('/:id', verifyToken, isRecruiter, deleteJob);
router.get('/recruiter/my-jobs', verifyToken, isRecruiter, getMyJobs);

module.exports = router;
