const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { converzationProvider } = require("../controller/conversation/conversation");


router.post('/converzation', middAuth, converzationProvider);

module.exports = router;
