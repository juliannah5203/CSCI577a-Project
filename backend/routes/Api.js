const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const settingController = require('../controllers/settingController');
const answerController = require('../controllers/answerController');
const suggestionController = require('../controllers/suggestionController');
const questionnaireController = require('../controllers/questionnaireController');

router.get("", async (req, res) => {res.status(200).json("Hello World!")})
router.get("/api", async (req, res) => {res.status(200).json("Hello World!")})

router.post('/api/users', userController.createUser);
router.get('/api/users', userController.getAllUsers);
router.get('/api/users/:id', userController.getUserById);
router.put('/api/users/:id', userController.updateUser);
router.delete('/api/users/:id', userController.deleteUser);

router.post('/api/settings', settingController.createSetting);
router.get('/api/settings/:userId', settingController.getSettingByUserId);
router.put('/api/settings/:userId', settingController.updateSetting);
router.delete('/api/settings/:userId', settingController.deleteSetting);

router.post('/api/answers', answerController.createAnswer);
router.get('/api/answers/:userId', answerController.getAnswersByUserId);
router.put('/api/answers/:id', answerController.updateAnswer);
router.delete('/api/answers/:id', answerController.deleteAnswer);

router.post('/api/suggestions', suggestionController.createSuggestion);
router.get('/api/suggestions/:userId', suggestionController.getSuggestionsByUserId);
router.put('/api/suggestions/:id', suggestionController.updateSuggestion);
router.delete('/api/suggestions/:id', suggestionController.deleteSuggestion);

router.post('/api/questionnaires', questionnaireController.createQuestionnaire);
router.get('/api/questionnaires', questionnaireController.getAllQuestionnaires);
router.get('/api/questionnaires/:id', questionnaireController.getQuestionnaireById);
router.put('/api/questionnaires/:id', questionnaireController.updateQuestionnaire);
router.delete('/api/questionnaires/:id', questionnaireController.deleteQuestionnaire);

module.exports = router;