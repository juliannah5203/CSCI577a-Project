const express = require('express');
const router = express.Router();
const userRoutes = require('./userRoutes');
const answerRoutes = require('./answerRoutes');
const questionnaireRoutes = require('./questionnaireRoutes');
const settingRoutes = require('./settingRoutes');
const suggestionRoutes = require('./suggestionRoutes');
const moodTrendRoutes = require('./moodTrendRoutes');
const authRoutes = require('./authRoutes');

// Mount all routes
router.use('/api', userRoutes);
router.use('/api', answerRoutes);
router.use('/api', questionnaireRoutes);
router.use('/api', settingRoutes);
router.use('/api', suggestionRoutes);
router.use('/api', moodTrendRoutes); // Add mood trend routes
router.use('/api/auth', authRoutes);

module.exports = router;
