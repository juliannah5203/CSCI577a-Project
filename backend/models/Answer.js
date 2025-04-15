const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionnaire_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Questionnaire', default: 0},
  date: { type: Date, default: Date.now },
  moodRating: { type: Number, required: true }, // 1-5 rating
  note: { type: String } // user notes
});

module.exports = mongoose.model('Answer', answerSchema);