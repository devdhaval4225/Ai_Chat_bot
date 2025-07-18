// const redis = require('../db/redis');

exports.middAuth = async function (req, res, next) {
  const requestId = req.headers['x-request-id'];

  if (!requestId) {
    return res.status(400).json({ error: 'Missing X-Request-Id header' });
  }

  try {
    // Check if the requestId already exists
    const deviceId = req.body.deviceId
    if (req.body && !deviceId) {
    return res.status(409).json({ error: 'Missing Device Id' });
  } else {
    if(requestId === deviceId) {
      next();
    } else {
      return res.status(409).json({ message: 'Unable to find the requested resource!' });
    }
  }
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
