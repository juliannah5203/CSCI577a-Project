const {checkLastCheckin} = require("../services/checkinService")

async function checkAlertMiddleware(req, res, next) {

  const userId = req.user.id;; //req.user.id; // req.session.user && req.session.user.id;

  const needsAlert = await checkLastCheckin(userId);

  req.needsAlert = needsAlert;

  next();
}

module.exports = checkAlertMiddleware;

