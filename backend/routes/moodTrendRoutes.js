const express = require('express');
const router = express.Router();
const moodTrendController = require('../controllers/moodTrendController');
const cacheMiddleware = require('../middleware/cacheMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(authMiddleware.isAuthenticated);

// Get mood trends for a user
router.get('/users/:userId/mood-trends', 
  cacheMiddleware.checkTrendCache,
  moodTrendController.getMoodTrends
);

// Get mood aggregation for a user
router.get('/users/:userId/mood-aggregation',
  cacheMiddleware.checkTrendCache,
  moodTrendController.getMoodAggregation
);

module.exports = router;
