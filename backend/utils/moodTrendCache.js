// Simple in-memory cache for mood trend data
const NodeCache = require('node-cache');

// Cache with TTL of 1 hour and check period of 10 minutes
const trendCache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

// Generate cache key from query parameters
const getCacheKey = (userId, range) => {
  return `trend:${userId}:${range}`;
};

// Get data from cache
exports.getCachedData = (userId, range) => {
  const key = getCacheKey(userId, range);
  return trendCache.get(key);
};

// Store data in cache
exports.setCachedData = (userId, range, data) => {
  const key = getCacheKey(userId, range);
  trendCache.set(key, data);
};

// Clear cache entries for a specific user
exports.clearUserCache = (userId) => {
  const keys = trendCache.keys();
  const userKeys = keys.filter(key => key.includes(`trend:${userId}:`));
  userKeys.forEach(key => trendCache.del(key));
};

// Clear all cache entries
exports.clearAllCache = () => {
  trendCache.flushAll();
};
