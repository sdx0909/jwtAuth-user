const JWT = require("jsonwebtoken");

// verifies the token and forward to next() controller
const jwtAuth = (req, res, next) => {
  // getting token from req
  const token = req.cookies && req.cookies.token;
  // if token is not exists
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "No token, authorization denied",
    });
  }
  // verify token with payload
  try {
    // verifying the token with SECRET-KEY
    const payload = JWT.verify(token, process.env.SECRET);
    // SETTING THE 'user.id' in req OBJECT
    req.user = { id: payload.id, email: payload.email };
  } catch (e) {
    // if token is invalid or expired
    return res.status(401).json({
      success: false,
      message: "Invalid token, authorization denied",
    });
  }
  // forward control to next() controller --> getUser / logout
  next();
};

// exporting the 'jwtAuth'
module.exports = jwtAuth;
