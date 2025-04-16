const {checkLastCheckin} = require("../services/checkinService")

async function checkAlertMiddleware(req, res, next) {

  const userId = req.user.userId;; //req.user.id; // req.session.user && req.session.user.id;

  try{  
    console.log(userId);
  }
  catch (err){
    console.log("err")
    next();
  }

  const needsAlert = await checkLastCheckin(userId);

  req.needsAlert = needsAlert;

  next();
}

module.exports = checkAlertMiddleware;

