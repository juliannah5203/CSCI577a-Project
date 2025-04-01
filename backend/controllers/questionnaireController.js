const Questionnaire = require('../models/Questionnaire');

// 创建问卷
exports.createQuestionnaire = async (req, res) => {
  try {
    const questionnaire = new Questionnaire(req.body);
    await questionnaire.save();
    res.status(201).json(questionnaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 获取所有问卷
exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await Questionnaire.find();
    res.json(questionnaires);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 获取单个问卷
exports.getQuestionnaireById = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findById(req.params.id);
    if (!questionnaire) return res.status(404).json({ error: 'Questionnaire not found' });
    res.json(questionnaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 更新问卷
exports.updateQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!questionnaire) return res.status(404).json({ error: 'Questionnaire not found' });
    res.json(questionnaire);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 删除问卷
exports.deleteQuestionnaire = async (req, res) => {
  try {
    const questionnaire = await Questionnaire.findByIdAndDelete(req.params.id);
    if (!questionnaire) return res.status(404).json({ error: 'Questionnaire not found' });

    // 删除关联的答案（可选）
    await Answer.deleteMany({ questionnaire_id: questionnaire._id });

    res.json({ message: 'Questionnaire deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};