const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  
  const [authType, authToken] = (authorization || "").split(" ");
  console.log("token", authToken);
  if (!authToken || authType !== "Bearer") {
    return res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }

  try {
    const {userId} = jwt.verify(authToken, "hannah-key");
    console.log("auth_id", userId);
    User.findOne({ user_id : userId}).exec().then((user) => {
      res.locals.user = user;
      next();
    });
   
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }
};