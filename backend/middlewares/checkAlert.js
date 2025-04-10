const dayjs = require('dayjs');
const Setting = require('./models/Setting');

async function checkLastCheckin(req, res, next) {
  const userId = req.user._id;  // 假设登录后你在 req.user 里塞了用户
  const lastCheckin = await Setting.findOne({ userId }).sort({ createdAt: -1 });

  req.needsAlert = false;
  if (lastCheckin) {
    const diff = dayjs().diff(dayjs(lastCheckin.createdAt), 'day');
    if (diff >= 3) {
      req.needsAlert = true;
    }
  } else {
    req.needsAlert = true;
  }
  next();
}

module.exports = checkLastCheckin;


// 登录路由加上这个中间件：

// const checkLastCheckin = require('./middlewares/checkLastCheckin');

// app.post('/login', authMiddleware, checkLastCheckin, (req, res) => {
//   res.json({
//     token: 'xxx',
//     user: req.user,
//     needsAlert: req.needsAlert
//   });
// });
