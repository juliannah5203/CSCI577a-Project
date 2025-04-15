const Answer = require('../models/Answer');
const moodTrendCache = require('../utils/moodTrendCache');

// 创建答案
exports.createAnswer = async (req, res) => {
  try {
    const answer = new Answer(req.body);
    await answer.save();

    // Addde: Clear user's cached mood trend data when a new answer is added
    moodTrendCache.clearUserCache(answer.user_id);
    
    res.status(201).json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

  // update last checkin time
  try {
      const setting = await Setting.findOneAndUpdate(
        { user_id: req.params.userId },
        { $set: { last_checkin_day: Date.now } },
        { new: true, runValidators: true }
      );
      if (!setting) return res.status(404).json({ error: 'Setting not found' });
      res.json(setting);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }

};

// 获取用户的答案（填充问卷信息）
exports.getAnswersByUserId = async (req, res) => {
  try {
    const answers = await Answer.find({ user_id: req.params.userId })
      .populate('questionnaire_id', 'diseases questions');
    res.json(answers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get answer based on id
exports.getAnswersById = async (req, res) => {
  try {
    const answers = await Answer.find({ _id: req.params.ansId })
      .populate('questionnaire_id', 'diseases questions');
    res.json(answers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 更新答案
exports.updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    // Addedd: Clear user's cached mood trend data when an answer is updated
    moodTrendCache.clearUserCache(answer.user_id);
    
    res.json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除答案
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id); // modified
    if (!answer) return res.status(404).json({ error: 'Answer not found' });

    const userId = answer.user_id; // added
    await Answer.findByIdAndDelete(req.params.id); // added

    // Aadded: Clear user's cached mood trend data when an answer is deleted
    moodTrendCache.clearUserCache(userId);
    
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get latest answer for a user
exports.getLatestAnswer = async (req, res) => {
  try {
    const answer = await Answer.findOne({ user_id: req.params.userId })
      .sort({ date: -1 })
      .populate('questionnaire_id', 'diseases questions');
      
    if (!answer) return res.status(404).json({ error: 'No answers found for this user' });
    
    res.json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get user's answers for a specific date range
exports.getAnswersByDateRange = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Add time to make the end date inclusive
    end.setHours(23, 59, 59, 999);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    const answers = await Answer.find({
      user_id: userId,
      date: { $gte: start, $lte: end }
    })
    .populate('questionnaire_id', 'diseases questions')
    .sort({ date: 1 });
    
    res.json(answers);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
