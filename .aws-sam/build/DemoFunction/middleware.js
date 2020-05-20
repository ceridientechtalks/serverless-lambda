const jwt = require("jsonwebtoken");

// exporting our custom middleware
module.exports = (req, res, next) => {
  //get token from the request header first
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ message: "no token, auth failed" });
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      console.log(err.name, err.message, err.expiredAt);

      // when there's an error during jwt decoding we response back
      res.status(401).json({ message: "token is not valid" });
    } else {
      req.username = decoded.username;
      next();
    }
  });
};
