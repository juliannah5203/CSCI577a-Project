const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, default: 'momo'},
  number: { type: String, default: '123456789'},
  email: { type: String, default: 'momo@gmail.com'},
  password: { type: String, default: '123456' },
  diseases: { type: String, enum: ['general', 'depression', 'anxiety'], default: 'general' },
  gender: { type: String },
  time_zone: { type: String , default: 'America/Los_Angeles'}
});

module.exports = mongoose.model('User', userSchema);