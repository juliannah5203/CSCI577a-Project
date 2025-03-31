const User = require('../models/User');
const Setting = require('../models/Setting');
const authUtils = require('../utils/authUtils');

// Get user profile from session
exports.getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find user by Google ID
    let user = await User.findOne({ google_id: req.user.id });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user profile data using safe response utility
    res.json(authUtils.createSafeUserResponse(user));
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user profile 
// redundant
// TODO: remove this
// exports.updateUserProfile = async (req, res) => {
//   try {
//     if (!req.user || !req.user.id) {
//       return res.status(401).json({ error: 'Not authenticated' });
//     }

//     // Validate profile update data
//     const validation = authUtils.validateProfileUpdate(req.body);
//     if (!validation.valid) {
//       return res.status(400).json({ error: 'Invalid profile data', details: validation.errors });
//     }

//     const { name, diseases, gender, time_zone } = req.body;
    
//     // Find user by Google ID
//     let user = await User.findOne({ google_id: req.user.id });
    
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Update user data
//     if (name) user.username = name;
//     if (diseases) user.diseases = diseases;
//     if (gender) user.gender = gender;
//     if (time_zone) user.time_zone = time_zone;

//     await user.save();

//     // Return updated user profile using safe response utility
//     res.json(authUtils.createSafeUserResponse(user));
//   } catch (err) {
//     console.error('Error updating user profile:', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// Find or create user from Google profile
exports.findOrCreateGoogleUser = async (profile) => {
  try {
    // Check if user exists by Google ID
    let user = await User.findOne({ google_id: profile.id });
    
    // If user doesn't exist, create new user
    if (!user) {
      // Format profile data for our database
      const profileData = authUtils.formatGoogleProfile(profile);
      
      user = new User({
        google_id: profileData.google_id,
        username: profileData.username,
        email: profileData.email,
        password: '', // No password for OAuth users
        diseases: 'general', // Default disease type
        time_zone: 'America/Los_Angeles' // Default timezone
      });
      
      await user.save();
      
      // Create default settings for new user
      const setting = new Setting({
        user_id: user._id,
        checkin_alert: true,
        checkin_alert_time: new Date()
      });
      
      await setting.save();
      console.log(`Created new user with Google ID: ${profile.id}`);
    } else {
      console.log(`Found existing user with Google ID: ${profile.id}`);
    }
    
    return user;
  } catch (err) {
    console.error('Error finding/creating Google user:', err);
    throw err;
  }
};

// Handle user logout
exports.logout = (req, res) => {
  req.logout(err => {
    if (err) { 
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'Logout failed' }); 
    }
    res.json({ message: 'Logged out successfully' });
  });
}; 