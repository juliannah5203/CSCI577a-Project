const Setting = require('../models/Setting');
const dayjs = require('dayjs');

async function checkLastCheckin(userId) {
  try{
    console.log(userId);
    let setting = await Setting.findOne({ user_id: userId }); // 强制从主库读
//    await Setting.findOne({ user_id: userId });
    const checkin_alert = setting.checkin_alert;
    if (!checkin_alert){
      return false;
    }
  
    const lastCheckin = setting.last_checkin_day;
    console.log("setting: : ", setting)

    // console.log("last: ", setting.last_checkin_day)
  
    const diff = dayjs().diff(dayjs(lastCheckin), 'day');
    return diff >= 3;
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = {
  checkLastCheckin
};