const mongoose = require('mongoose');
require('dotenv').config();

// 引入模型
const User = require('./models/User');
const Setting = require('./models/Setting');
const Answer = require('./models/Answer');
const Suggestion = require('./models/Suggestion');
const Questionnaire = require('./models/Questionnaire');

// 连接 MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// 测试函数
const populateTest = async () => {
  try {
    // 清空数据库（仅用于测试）
    await User.deleteMany({});
    await Setting.deleteMany({});
    await Answer.deleteMany({});
    await Suggestion.deleteMany({});
    await Questionnaire.deleteMany({});
    console.log('Database cleared');

    // 创建测试用户
    const user = new User({
      username: 'test_user',
      number: '12345',
      email: 'test@example.com',
      password: 'password123',
      diseases: 'depression',
      gender: 'male',
      region: 'US'
    });
    await user.save();
    console.log('User created:', user.username);

    // 创建设置
    const setting = new Setting({
      user_id: user._id,
      check_frequency: 'daily',
      checkin_alert: true,
      checkin_alert_time: '08:00',
      emergency_contact: 'emergency@example.com'
    });
    await setting.save();
    console.log('Setting created for user:', user._id);

    // 创建问卷
    const questionnaire = new Questionnaire({
      diseases: 'depression',
      questions: ['How are you feeling today?', 'Have you felt anxious recently?']
    });
    await questionnaire.save();
    console.log('Questionnaire created:', questionnaire._id);

    // 创建答案
    const answer = new Answer({
      user_id: user._id,
      questionnaire_id: questionnaire._id,
      answers: ['Not great', 'Yes'],
      notes: 'Feeling stressed'
    });
    await answer.save();
    console.log('Answer created:', answer._id);

    // 创建建议
    const suggestion = new Suggestion({
      user_id: user._id,
      content: 'Consider taking a walk to reduce stress.'
    });
    await suggestion.save();
    console.log('Suggestion created:', suggestion._id);

    // 使用 populate 查询数据
    console.log('\n=== Testing Populate ===\n');

    // 查询用户的设置（填充用户信息）
    const userSetting = await Setting.findOne({ user_id: user._id })
      .populate('user_id', 'username email');
    console.log('User Setting with Populated User:', JSON.stringify(userSetting, null, 2));

    // 查询用户的答案（填充问卷信息）
    const userAnswers = await Answer.find({ user_id: user._id })
      .populate('questionnaire_id', 'diseases questions');
    console.log('User Answers with Populated Questionnaire:', JSON.stringify(userAnswers, null, 2));

    // 查询用户的建议（填充用户信息）
    const userSuggestions = await Suggestion.find({ user_id: user._id })
      .populate('user_id', 'username email');
    console.log('User Suggestions with Populated User:', JSON.stringify(userSuggestions, null, 2));

    // 查询用户的所有信息（综合填充）
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
    // 关闭数据库连接
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// 运行测试
populateTest();