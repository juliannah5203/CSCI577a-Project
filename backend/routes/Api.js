const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const settingController = require('../controllers/settingController');
const answerController = require('../controllers/answerController');
const suggestionController = require('../controllers/suggestionController');
const questionnaireController = require('../controllers/questionnaireController');
const authController = require('../controllers/authController');
const { isAuthenticated } = require('../middlewares/authMiddleware');
// added
const moodTrendController = require('../controllers/moodTrendController');
const cacheMiddleware = require('../middleware/cacheMiddleware');


/**
 * @swagger
 * /:
 *   get:
 *     description: "Returns a Hello World message."
 *     responses:
 *       200:
 *         description: "A successful response with 'Hello World!' message."
 */
router.get("", async (req, res) => { res.status(200).json("Hello World!"); });

/**
 * @swagger
 * /api:
 *   get:
 *     description: "Returns a Hello World message for API route."
 *     responses:
 *       200:
 *         description: "A successful response with 'Hello World!' message."
 */
router.get("/api", async (req, res) => { res.status(200).json("Hello World!"); });

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     description: "Fetches the user profile for authenticated user."
 *     responses:
 *       200:
 *         description: "Returns the user's profile."
 *       401:
 *         description: "Unauthorized access."
 */
// router.get('/api/users/profile', isAuthenticated, authController.getUserProfile);
router.get('/api/users/profile', authController.getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     description: "Updates the user profile for authenticated user."
 *     responses:
 *       200:
 *         description: "User profile updated successfully."
 *       401:
 *         description: "Unauthorized access."
 */
//router.put('/api/users/profile', isAuthenticated, authController.updateUserProfile);
router.put('/api/users/profile', authController.updateUserProfile);  


/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     description: "Logs out the user."
 *     responses:
 *       200:
 *         description: "Successfully logged out."
 *       401:
 *         description: "Unauthorized access."
 */
router.post('/api/users/logout', isAuthenticated, authController.logout);

/**
 * @swagger
 * /api/users:
 *   post:
 *     description: "Creates a new user."
 *     responses:
 *       201:
 *         description: "User created successfully."
 *       400:
 *         description: "Invalid user data."
 */
router.post('/api/users', userController.createUser);

/**
 * @swagger
 * /api/users:
 *   get:
 *     description: "Fetches all users."
 *     responses:
 *       200:
 *         description: "Returns a list of users."
 */
router.get('/api/users', userController.getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     description: "Fetches a user by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Returns a user by ID."
 *       404:
 *         description: "User not found."
 */
router.get('/api/users/:id', userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     description: "Updates a user by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "User updated successfully."
 *       400:
 *         description: "Invalid data provided."
 */
router.put('/api/users/:id', userController.updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     description: "Deletes a user by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "User deleted successfully."
 *       404:
 *         description: "User not found."
 */
router.delete('/api/users/:id', userController.deleteUser);

/**
 * @swagger
 * /api/settings:
 *   post:
 *     description: "Creates a new setting."
 *     responses:
 *       201:
 *         description: "Setting created successfully."
 *       400:
 *         description: "Invalid setting data."
 */
router.post('/api/settings', settingController.createSetting);

/**
 * @swagger
 * /api/settings/{userId}:
 *   get:
 *     description: "Fetches the setting by user ID."
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Returns the user's settings."
 */
router.get('/api/settings/:userId', settingController.getSettingByUserId);

/**
 * @swagger
 * /api/settings/{userId}:
 *   put:
 *     description: "Updates the setting by user ID."
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Setting updated successfully."
 */
router.put('/api/settings/:userId', settingController.updateSetting);

/**
 * @swagger
 * /api/settings/{userId}:
 *   delete:
 *     description: "Deletes the setting by user ID."
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Setting deleted successfully."
 */
router.delete('/api/settings/:userId', settingController.deleteSetting);

/**
 * @swagger
 * /api/answers:
 *   post:
 *     description: "Creates a new answer."
 *     responses:
 *       201:
 *         description: "Answer created successfully."
 *       400:
 *         description: "Invalid answer data."
 */
router.post('/api/answers', answerController.createAnswer);

/**
 * @swagger
 * /api/answers/{userId}:
 *   get:
 *     description: "Fetches answers by user ID."
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Returns the answers by user."
 */
router.get('/api/answers/:userId', answerController.getAnswersByUserId);

/**
 * @swagger
 * /api/answers/{id}:
 *   put:
 *     description: "Updates an answer by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Answer's unique identifier."
 *     responses:
 *       200:
 *         description: "Answer updated successfully."
 */
router.put('/api/answers/:id', answerController.updateAnswer);

/**
 * @swagger
 * /api/answers/{id}:
 *   delete:
 *     description: "Deletes an answer by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Answer's unique identifier."
 *     responses:
 *       200:
 *         description: "Answer deleted successfully."
 */
router.delete('/api/answers/:id', answerController.deleteAnswer);

/**
 * @swagger
 * /api/suggestions:
 *   post:
 *     description: "Creates a new suggestion."
 *     responses:
 *       201:
 *         description: "Suggestion created successfully."
 *       400:
 *         description: "Invalid suggestion data."
 */
router.post('/api/suggestions', suggestionController.createSuggestion);

/**
 * @swagger
 * /api/suggestions/{userId}:
 *   get:
 *     description: "Fetches suggestions by user ID."
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: "User's unique identifier."
 *     responses:
 *       200:
 *         description: "Returns the suggestions by user."
 */
router.get('/api/suggestions/:userId', suggestionController.getSuggestionsByUserId);

/**
 * @swagger
 * /api/suggestions/{id}:
 *   put:
 *     description: "Updates a suggestion by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Suggestion's unique identifier."
 *     responses:
 *       200:
 *         description: "Suggestion updated successfully."
 */
router.put('/api/suggestions/:id', suggestionController.updateSuggestion);

/**
 * @swagger
 * /api/suggestions/{id}:
 *   delete:
 *     description: "Deletes a suggestion by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Suggestion's unique identifier."
 *     responses:
 *       200:
 *         description: "Suggestion deleted successfully."
 */
router.delete('/api/suggestions/:id', suggestionController.deleteSuggestion);

/**
 * @swagger
 * /api/questionnaires:
 *   post:
 *     description: "Creates a new questionnaire."
 *     responses:
 *       201:
 *         description: "Questionnaire created successfully."
 *       400:
 *         description: "Invalid questionnaire data."
 */
router.post('/api/questionnaires', questionnaireController.createQuestionnaire);

/**
 * @swagger
 * /api/questionnaires:
 *   get:
 *     description: "Fetches all questionnaires."
 *     responses:
 *       200:
 *         description: "Returns a list of questionnaires."
 */
router.get('/api/questionnaires', questionnaireController.getAllQuestionnaires);

/**
 * @swagger
 * /api/questionnaires/{id}:
 *   get:
 *     description: "Fetches a questionnaire by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Questionnaire's unique identifier."
 *     responses:
 *       200:
 *         description: "Returns the questionnaire by ID."
 */
router.get('/api/questionnaires/:id', questionnaireController.getQuestionnaireById);

/**
 * @swagger
 * /api/questionnaires/{id}:
 *   put:
 *     description: "Updates a questionnaire by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Questionnaire's unique identifier."
 *     responses:
 *       200:
 *         description: "Questionnaire updated successfully."
 */
router.put('/api/questionnaires/:id', questionnaireController.updateQuestionnaire);

/**
 * @swagger
 * /api/questionnaires/{id}:
 *   delete:
 *     description: "Deletes a questionnaire by ID."
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "Questionnaire's unique identifier."
 *     responses:
 *       200:
 *         description: "Questionnaire deleted successfully."
 */
router.delete('/api/questionnaires/:id', questionnaireController.deleteQuestionnaire);

// added
router.get('/users/:userId/mood-trends', isAuthenticated, cacheMiddleware.checkTrendCache, moodTrendController.getMoodTrends);
router.get('/users/:userId/mood-aggregation', isAuthenticated, cacheMiddleware.checkTrendCache, moodTrendController.getMoodAggregation);

// router.get("", async (req, res) => {res.status(200).json("Hello World!")})
// router.get("/api", async (req, res) => {res.status(200).json("Hello World!")})

// // User profile routes for Google OAuth
// router.get('/api/users/profile', isAuthenticated, authController.getUserProfile);
// // router.put('/api/users/profile', isAuthenticated, authController.updateUserProfile);
// router.post('/api/users/logout', isAuthenticated, authController.logout);

// // Existing user CRUD routes
// router.post('/api/users', userController.createUser);
// router.get('/api/users', userController.getAllUsers);
// router.get('/api/users/:id', userController.getUserById);
// router.put('/api/users/:id', userController.updateUser);
// router.delete('/api/users/:id', userController.deleteUser);

// router.post('/api/settings', settingController.createSetting);
// router.get('/api/settings/:userId', settingController.getSettingByUserId);
// router.put('/api/settings/:userId', settingController.updateSetting);
// router.delete('/api/settings/:userId', settingController.deleteSetting);

// router.post('/api/answers', answerController.createAnswer);
// router.get('/api/answers/:userId', answerController.getAnswersByUserId);
// router.put('/api/answers/:id', answerController.updateAnswer);
// router.delete('/api/answers/:id', answerController.deleteAnswer);

// router.post('/api/suggestions', suggestionController.createSuggestion);
// router.get('/api/suggestions/:userId', suggestionController.getSuggestionsByUserId);
// router.put('/api/suggestions/:id', suggestionController.updateSuggestion);
// router.delete('/api/suggestions/:id', suggestionController.deleteSuggestion);

// router.post('/api/questionnaires', questionnaireController.createQuestionnaire);
// router.get('/api/questionnaires', questionnaireController.getAllQuestionnaires);
// router.get('/api/questionnaires/:id', questionnaireController.getQuestionnaireById);
// router.put('/api/questionnaires/:id', questionnaireController.updateQuestionnaire);
// router.delete('/api/questionnaires/:id', questionnaireController.deleteQuestionnaire);

module.exports = router;
