const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  checkin_alert: { type: Boolean, default: true }, // switch alert
  // check_frequency: { type: Number }, // 0:daily 1:weekly 2:monthly
  // checkin_alert_time_begin: { type: Date, default:  new Date()}, 
  // checkin_alert_time_end: { type: Date, default:  new Date()}, 
  emergency_contact: { type: String }, // email or number
  // linked_account: { type: String },
  last_checkin_day: {type: Date,  default: new Date(-8640000000000000)}
});

module.exports = mongoose.model('Setting', settingSchema);