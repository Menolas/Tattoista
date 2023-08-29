const jwt = require('jsonwebtoken');
const { secret } = require('../config');

module.exports = function () {
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return res.status(200).json({ message: "Not authorized user" });
      }
      const decodedData = jwt.verify(token, secret);
      req.user = decodedData;
      next();
    } catch (e) {
      console.log(e);
      return res.status(403).json({ message: "Did not catch" });
    }
  }
}
