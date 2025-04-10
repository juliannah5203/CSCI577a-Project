const mongoose = require('mongoose');
require('dotenv').config();

// For test only

const User = require('./models/User');
const Setting = require('./models/Setting');
const Answer = require('./models/Answer');
const Suggestion = require('./models/Suggestion');
const Questionnaire = require('./models/Questionnaire');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const populateTest = async () => {
  try {
    await User.deleteMany({});
    await Setting.deleteMany({});
    await Answer.deleteMany({});
    await Suggestion.deleteMany({});
    await Questionnaire.deleteMany({});
    console.log('Database cleared');

    const user = new User({
      username: 'test_user',
      number: '12345',
      email: 'test@example.com',
      password: 'password123',
      diseases: 'depression',
    });
    await user.save();
    console.log('User created:', user.username);

    const setting = new Setting({
      user_id: user._id,
      checkin_alert: true,
      emergency_contact: 'emergency@example.com'
    });
    await setting.save();
    console.log('Setting created for user:', user._id);

    const questionnaire = new Questionnaire({
      diseases: 'depression',
      questions: ['How are you feeling today?', 'Have you felt anxious recently?']
    });
    await questionnaire.save();
    console.log('Questionnaire created:', questionnaire._id);

    const answer = new Answer({
      user_id: user._id,
      questionnaire_id: questionnaire._id,
      moodRating: 3,
      note: 'Feeling stressed'
    });
    await answer.save();
    console.log('Answer created:', answer._id);

    const suggestion = new Suggestion({
      user_id: user._id,
      content: 'Consider taking a walk to reduce stress.'
    });
    await suggestion.save();
    console.log('Suggestion created:', suggestion._id);

    console.log('\n=== Testing Populate ===\n');

    const userSetting = await Setting.findOne({ user_id: user._id })
      .populate('user_id', 'username email');
    console.log('User Setting with Populated User:', JSON.stringify(userSetting, null, 2));

    const userAnswers = await Answer.find({ user_id: user._id })
      .populate('questionnaire_id', 'diseases questions');
    console.log('User Answers with Populated Questionnaire:', JSON.stringify(userAnswers, null, 2));

    const userSuggestions = await Suggestion.find({ user_id: user._id })
      .populate('user_id', 'username email');
    console.log('User Suggestions with Populated User:', JSON.stringify(userSuggestions, null, 2));

    const userData = await User.findById(user._id);
    const settingData = await Setting.findOne({ user_id: user._id });
    const answersData = await Answer.find({ user_id: user._id })
      .populate('questionnaire_id', 'diseases questions');
    const suggestionsData = await Suggestion.find({ user_id: user._id });

    console.log('\n=== Comprehensive User Data ===\n');
    console.log('User:', JSON.stringify(userData, null, 2));
    console.log('Setting:', JSON.stringify(settingData, null, 2));
    console.log('Answers:', JSON.stringify(answersData, null, 2));
    console.log('Suggestions:', JSON.stringify(suggestionsData, null, 2));
  } catch (err) {
    console.error('Error during populate test:', err);
  } finally {

    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

populateTest();