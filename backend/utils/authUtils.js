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

// Validates that profile update data is valid (allows partial updates)
exports.validateProfileUpdate = (body) => {
  const { name, region, sex } = body;
  const errors = {};
  
  // Only validate fields that are included in the update
  if (name !== undefined && !name) errors.name = 'Name cannot be empty';
  if (region !== undefined && !region) errors.region = 'Region cannot be empty';
  if (sex !== undefined && !sex) errors.sex = 'Sex cannot be empty';

  if (Object.keys(errors).length > 0) {
    return { valid: false, errors };
  }
  
  return { valid: true };
}; 