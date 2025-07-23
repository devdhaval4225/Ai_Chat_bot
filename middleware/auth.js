const { decrypt,encrypt } = require("../helper/common");

exports.middAuth = async function (req, res, next) {
  const header = req.headers
  let requestId = header['x-request-id'];
  let uniqueId = header['uniqueid'];

  if (requestId && requestId.length > 0 && uniqueId && uniqueId.length > 0) {
    const newReq = await encrypt(requestId)
    requestId = await decrypt(newReq)
  } else {
    return res.status(400).json({ error: 'Missing header' });
  }

  try {
    const deviceId = req.body.deviceId
    if (!deviceId) {
    return res.status(409).json({ error: 'Missing Device Id' });
  } else {
    // if(requestId === deviceId) {
      next();
    // } else {
    //   return res.status(409).json({ message: 'Unable to find the requested resource!' });
    // }
  }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
