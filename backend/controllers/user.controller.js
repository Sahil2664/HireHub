const User = require('../models/User.model');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { profile } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profile },
      { new: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};