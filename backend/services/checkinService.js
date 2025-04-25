const Setting = require('../models/Setting');
const User = require('../models/User');
const dayjs = require('dayjs');

const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(utc);
dayjs.extend(timezone);

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
    // console.log("setting: : ", setting)

    // console.log("last: ", setting.last_checkin_day)

    const user = await User.findOne({ _id: userId }); // 强制从主库读
  
    const diff = dayjs().tz(user.time_zone).diff(dayjs(lastCheckin).tz(user.time_zone), 'day');

    console.log("Today: ", dayjs().tz(user.time_zone), "Last: ", dayjs(lastCheckin).tz(user.time_zone))

    console.log(diff)

    return diff >= 3;
  }
  catch (err) {
    console.log(err)
  }
}

module.exports = {
  checkLastCheckin
};