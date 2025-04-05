const mongoose = require('mongoose');

const questionnaireSchema = new mongoose.Schema({
  diseases: { type: String, enum: ['general', 'depression', 'anxiety'], default: 'general' },
  questions: { type: [String], required: true } 
});

module.exports = mongoose.model('Questionnaire', questionnaireSchema);