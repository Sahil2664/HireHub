exports.isRecruiter = (req, res, next) => {
  if (req.user.role !== 'recruiter') {
    return res.status(403).json({ message: 'Access denied. Recruiters only.' });
  }
  next();
};

exports.isSeeker = (req, res, next) => {
  if (req.user.role !== 'seeker') {
    return res.status(403).json({ message: 'Access denied. Job seekers only.' });
  }
  next();
};