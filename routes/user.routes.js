const router = require('express').Router();

const { login } = require("../controller/userAuth/login");


router.post('/login',login);

module.exports = router;
