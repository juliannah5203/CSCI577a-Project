const User = require('../models/User');
const Setting = require('../models/Setting');
const authUtils = require('../utils/authUtils');

// Debug mode toggle - set to true to enable debug logs
const DEBUG_MODE = false;

// Debug logging helper
const debugLog = (message, data) => {
  if (DEBUG_MODE) {
    console.log(`[AUTH DEBUG] ${message}`, data || '');
  }
};

// Get user profile from session
exports.getUserProfile = async (req, res) => {
  try {
    debugLog('getUserProfile called with session:', req.user);
    
    if (!req.user || !req.user.id) {
      debugLog('Not authenticated - no user in session');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Find user by Google ID
    debugLog('Looking up user with Google ID:', req.user.id);
    let user = await User.findOne({ google_id: req.user.id });
    
    if (!user) {
      debugLog('User not found for Google ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    debugLog('User found:', { id: user._id, google_id: user.google_id, username: user.username });
    
    // Return user profile data using safe response utility
    const response = authUtils.createSafeUserResponse(user);
    debugLog('Returning profile response:', response);
    res.json(response);
  } catch (err) {
    console.error('Error getting user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    debugLog('updateUserProfile called with data:', req.body);
    
    if (!req.user || !req.user.id) {
      debugLog('Not authenticated - no user in session');
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Validate profile update data
    debugLog('Validating profile update data');
    const validation = authUtils.validateProfileUpdate(req.body);
    if (!validation.valid) {
      debugLog('Invalid profile data:', validation.errors);
      return res.status(400).json({ error: 'Invalid profile data', details: validation.errors });
    }

    // Map frontend field names to database field names
    const { name, region, sex } = req.body;
    debugLog('Parsed update fields:', { name, region, sex });
    
    // Find user by Google ID
    debugLog('Looking up user with Google ID:', req.user.id);
    let user = await User.findOne({ google_id: req.user.id });
    
    if (!user) {
      debugLog('User not found for Google ID:', req.user.id);
      return res.status(404).json({ error: 'User not found' });
    }

    debugLog('User found:', { id: user._id, google_id: user.google_id, username: user.username });
    
    // Update user data
    if (name) user.username = name;
    if (sex) user.gender = sex;
    if (region) user.time_zone = region;

    debugLog('Saving updated user data');
    await user.save();
    debugLog('User data updated successfully');

    // Return updated user profile using safe response utility
    const response = authUtils.createSafeUserResponse(user);
    debugLog('Returning updated profile response:', response);
    res.json(response);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

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