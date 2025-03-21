const jwt = require('jsonwebtoken');
const AnonymousSession = require('../models/AnonymousSession');

module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');
  const anonymousId = req.header('x-anonymous-id');

  if (!token && !anonymousId) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.userId;
    } else if (anonymousId) {
      const session = await AnonymousSession.findOne({ anonymousId });
      if (!session) {
        return res.status(401).json({ msg: 'Invalid anonymous session' });
      }
      req.anonymousUser = session;
    }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};