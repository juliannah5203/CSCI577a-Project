const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionnaire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire', required: true },
  date: { type: Date, default: Date.now },
  answers: { type: [String], required: true }, // 1-5 rating
  notes: { type: String } // user notes
});

module.exports = mongoose.model('Answer', answerSchema);