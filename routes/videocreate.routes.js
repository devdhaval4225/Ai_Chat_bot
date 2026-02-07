const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { videoCreateProvider } = require("../controller/videoCreation/videoCreate");


router.post('/create', middAuth, videoCreateProvider);

module.exports = router;
