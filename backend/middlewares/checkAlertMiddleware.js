const {checkLastCheckin} = require("../services/checkinService")

async function checkAlertMiddleware(req, res, next) {

  // TODO: user_id
  const userId = "67fe2965de23dba663a9ed55"; //req.user.id; // req.session.user && req.session.user.id;

  const needsAlert = await checkLastCheckin(userId);

  req.needsAlert = needsAlert;

  next();
}

module.exports = checkAlertMiddleware;

