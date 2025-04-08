const moodTrendCache = require('../utils/moodTrendCache');

// Middleware to check cache before processing request
exports.checkTrendCache = (req, res, next) => {
  const userId = req.params.userId;
  const range = parseInt(req.query.range) || 7;
  
  // Skip caching for non-GET requests
  if (req.method !== 'GET') {
    return next();
  }
  
  // Try to get data from cache
  const cachedData = moodTrendCache.getCachedData(userId, range);
  
  if (cachedData) {
    // Return cached data
    return res.json(cachedData);
  }
  
  // Add a function to the response object to cache the response data
  res.cacheData = (data) => {
    moodTrendCache.setCachedData(userId, range, data);
  };
  
  next();
};
