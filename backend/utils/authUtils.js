/**
 * Authentication utilities
 */

// Format Google profile data for our database schema
exports.formatGoogleProfile = (profile) => {
  return {
    google_id: profile.id,
    username: profile.displayName || 'User',
    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
    profilePicture: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null
  };
};

// Generate a safe response object without sensitive information
exports.createSafeUserResponse = (user) => {
  return {
    userId: user._id,
    googleId: user.google_id,
    email: user.email,
    name: user.username,
    diseases: user.diseases,
    gender: user.gender,
    time_zone: user.time_zone
  };
};

// Validates that all required fields are present in a profile update
exports.validateProfileUpdate = (body) => {
  const { name, region, sex } = body;
  const errors = {};
  if (!name) errors.name = 'Name is required';
  if (!region) errors.region = 'Region is required';
  if (!sex) errors.sex = 'Sex is required';

  // Add any validation rules for the frontend fields
  
  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true };
}; 