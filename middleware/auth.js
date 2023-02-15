const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token =req.headers["authorization"]

  if (!token) {
    return res.status(403).send({status:0,token:"Please login to continue."});
  }
  try {
    //check
    const token =req.headers["authorization"].replace('Bearer ', '')
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send({status:0,token:"Session Invalid"});
  }
  return next();
};

module.exports = verifyToken;