// Middleware to check if user is authenticated
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'You are not authenticated' });
};

// Middleware to check if the user has access to a specific resource
exports.hasResourceAccess = (resourceField) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'You are not authenticated' });
    }
    
    // For parameterized routes like /api/users/:id where the parameter is 'id'
    // and we want to check if the user has access to this user's data
    if (req.params[resourceField] && req.user.id !== req.params[resourceField]) {
      return res.status(403).json({ error: 'You do not have permission to access this resource' });
    }
    
    next();
  };
}; 