const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { imageCreateProvider } = require("../controller/imageCreation/imageCreate");


router.post('/create', middAuth, imageCreateProvider);

module.exports = router;
