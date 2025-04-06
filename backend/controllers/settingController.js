const Setting = require('../models/Setting');

// 创建设置
exports.createSetting = async (req, res) => {
  try {
    const setting = new Setting(req.body);
    await setting.save();
    res.status(201).json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 获取用户的设置（填充用户信息）
exports.getSettingByUserId = async (req, res) => {
  try {
    const setting = await Setting.findOne({ user_id: req.params.userId })
      .populate('user_id', 'username email');
    if (!setting) return res.status(404).json({ error: 'Setting not found' });
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 更新设置
exports.updateSetting = async (req, res) => {
  try {
    const setting = await Setting.findOneAndUpdate(
      { user_id: req.params.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!setting) return res.status(404).json({ error: 'Setting not found' });
    res.json(setting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除设置
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOneAndDelete({ user_id: req.params.userId });
    if (!setting) return res.status(404)
      .json({ error: 'Setting not found' });
    res.json({ message: 'Setting deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};