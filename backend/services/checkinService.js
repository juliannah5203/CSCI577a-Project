const Setting = require('../models/Setting');
const dayjs = require('dayjs');

async function checkLastCheckin(userId) {
  const lastCheckin = await Setting.findOne({ userId }).sort({ createdAt: -1 });

  if (!lastCheckin) return true;

  const diff = dayjs().diff(dayjs(lastCheckin.createdAt), 'day');
  return diff >= 3;
}

module.exports = {
  checkLastCheckin
};