const express = require('express');
const { parseResume, getRecommendedJobs, getJobMatchScore } = require('../controllers/ml.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { isSeeker } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');
const router = express.Router();

// Parse resume (upload PDF)
router.post('/parse-resume', verifyToken, isSeeker, upload.single('resume'), parseResume);

// Get AI-recommended jobs
router.get('/recommended-jobs', verifyToken, isSeeker, getRecommendedJobs);

// Get match score for specific job
router.get('/match-score/:jobId', verifyToken, isSeeker, getJobMatchScore);

module.exports = router;