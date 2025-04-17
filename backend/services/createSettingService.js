const Setting = require('../models/Setting');

async function createSetting(userId) {
    try {
        const setting = new Setting({
            "user_id": userId,
            "checkin_alert": true,
            "emergency_contact": "emergency@example.com"
        });
        await setting.save();
    } catch (err) {
    }
}

module.exports = {
    createSetting
};
