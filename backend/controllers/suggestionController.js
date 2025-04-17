const Suggestion = require('../models/Suggestion');

// 创建建议
exports.createSuggestion = async (req, res) => {
  try {
    const suggestion = new Suggestion(req.body);
    await suggestion.save();
    res.status(201).json(suggestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 获取用户的建议（填充用户信息）
exports.getSuggestionsByUserId = async (req, res) => {
  try {
    const suggestions = await Suggestion.find({ user_id: req.params.userId });
    res.json(suggestions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 更新建议
exports.updateSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!suggestion) return res.status(404).json({ error: 'Suggestion not found' });
    res.json(suggestion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除建议
exports.deleteSuggestion = async (req, res) => {
  try {
    const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
    if (!suggestion) return res.status(404).json({ error: 'Suggestion not found' });
    res.json({ message: 'Suggestion deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};