const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (req.headers.authorization === undefined) {
    return res.status(401).json({ error: "Auth Error" });
  } else {
    let token = req.headers.authorization.split(" ")[1];
    try {
      jwt.verify(token, process.env.SECRET_OR_KEY, function (err, decoded) {
        if (err) {
          res.status(500).send({ error: "Invalid Token or signature" });
        }
        res.locals.user = decoded;
        next();
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ error: "Invalid Token" });
    }
  }
};
