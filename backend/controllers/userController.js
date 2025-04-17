const User = require('../models/User');
const Setting = require('../models/Setting');
const Answer = require('../models/Answer');
const Suggestion = require('../models/Suggestion');

// 创建用户
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    
    res.status(400).json({ error: err.message });
  }
};

// 获取单个用户（填充设置、答案和建议）
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const setting = await Setting.findOne({ user_id: user._id });
    const answers = await Answer.find({ user_id: user._id })
    const suggestions = await Suggestion.find({ user_id: user._id });

    res.json({ user, setting, answers, suggestions });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // 删除关联数据（可选）
    await Setting.deleteOne({ user_id: user._id });
    await Answer.deleteMany({ user_id: user._id });
    await Suggestion.deleteMany({ user_id: user._id });

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};