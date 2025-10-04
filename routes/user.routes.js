const router = require('express').Router();
const {middAuth} = require("../middleware/auth");
const { login } = require("../controller/userAuth/login");


router.post('/login',middAuth,login);

module.exports = router;
