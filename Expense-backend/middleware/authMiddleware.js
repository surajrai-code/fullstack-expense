const jwt = require('jsonwebtoken');
const User = require('../models/userModals');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. Missing token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optionally, fetch the user from the database to ensure the user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Access denied. User not found.' });
    }

    // Attach the user object to the request for use in the next middleware/controller
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Access denied. Invalid token.' });
  }
};
