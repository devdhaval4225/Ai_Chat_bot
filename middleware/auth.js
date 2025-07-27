const { decrypt,encrypt } = require("../helper/common");
const User = require("../model/user.model");

exports.middAuth = async function (req, res, next) {
  const header = req.headers
  let requestId = header['x-request-id'];
  let uniqueId = header['uniqueid'];

  if (requestId && requestId.length > 0 && uniqueId && uniqueId.length > 0) {
    // newReq this variable for testing local
    const newReq = await encrypt(requestId)
    console.log("--newReq---",typeof newReq,newReq)
    requestId = await decrypt(newReq)
  } else {
    res.status(400).json({ error: 'Missing header' });
  }

  try {
    const deviceId = req.body.deviceId
    if (!deviceId) {
    res.status(400).json({ error: 'Missing Device Id' });
  } else {
    if(requestId === deviceId) {
      next();
    } else {
      res.status(409).json({ message: 'Unable to find the requested resource!' });
    }
  }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
