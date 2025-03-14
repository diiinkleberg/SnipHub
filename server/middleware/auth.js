// Middleware to check if user is authenticated
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get the token from request header
  const token = req.header('x-auth-token');

  // If no token is provided, return error
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user data to request object
    req.user = decoded.user;

    // Move to the next middleware
    next();
  } catch (err) {
    // If token is invalid, return error
    res.status(401).json({ message: 'Token is not valid' });
  }
};
