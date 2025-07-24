const router = require('express').Router();

const { provider } = require("../controller/thirdPartyProvider/apiProvider");
const { aiBot } = require("../controller/thirdPartyProvider/openAiBot");


router.post('/provider/:deviceId',provider);
router.post('/aibot/:deviceId',aiBot);

module.exports = router;
