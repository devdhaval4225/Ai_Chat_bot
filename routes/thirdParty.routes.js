const router = require('express').Router();

const { provider } = require("../controller/thirdPartyProvider/apiProvider");


router.post('/provider/:deviceId/:apiProvider',provider);

module.exports = router;
