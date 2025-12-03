const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { aiProvider } = require("../controller/aiModel/model");


router.post('/getAll', middAuth, aiProvider);

module.exports = router;
