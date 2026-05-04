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

// NEW - Save parsed resume data to profile
exports.saveResumeData = async (req, res) => {
  try {
    const { parsedData } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Update profile with parsed data
    user.profile = {
      ...user.profile,
      phone: parsedData.phone || user.profile?.phone,
      skills: parsedData.skills || user.profile?.skills || [],
      parsedResume: {
        education: parsedData.education || [],
        experience_years: parsedData.experience_years || 0,
        raw_text: parsedData.raw_text || ''
      }
    };
    
    await user.save();
    
    res.status(200).json({
      message: 'Resume data saved successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profile: user.profile
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};