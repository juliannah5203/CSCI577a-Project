const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  // check_frequency: { type: Number }, // 
  checkin_alert: { type: Boolean, default: true }, // switch alert
  checkin_alert_time: { type: Date, default:  new Date()}, 
  emergency_contact: { type: String }, // email or number
  linked_account: { type: String }
});

module.exports = mongoose.model('Setting', settingSchema);