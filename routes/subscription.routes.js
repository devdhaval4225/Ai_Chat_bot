const router = require('express').Router();

const { planSubscribe } = require("../controller/subscription/subscription");


router.post('/subscribe',planSubscribe);

module.exports = router;
