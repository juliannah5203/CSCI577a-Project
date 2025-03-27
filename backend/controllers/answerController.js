const Answer = require('../models/Answer');

// 创建答案
exports.createAnswer = async (req, res) => {
  try {
    const answer = new Answer(req.body);
    await answer.save();
    res.status(201).json(answer);
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

// 更新答案
exports.updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    res.json(answer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除答案
exports.deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findByIdAndDelete(req.params.id);
    if (!answer) return res.status(404).json({ error: 'Answer not found' });
    res.json({ message: 'Answer deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};