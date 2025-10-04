const router = require('express').Router();
const {middAuth} = require("../middleware/auth");
const { planSubscribe } = require("../controller/subscription/subscription");


router.post('/subscribe',middAuth,planSubscribe);

module.exports = router;
