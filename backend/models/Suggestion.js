const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  content: { type: String, required: true } 
});

module.exports = mongoose.model('Suggestion', suggestionSchema);