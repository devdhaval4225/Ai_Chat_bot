const router = require('express').Router();

const { provider } = require("../controller/thirdPartyProvider/apiProvider");
const { aiBot } = require("../controller/thirdPartyProvider/openAiBot");


router.post('/provider',provider);
router.post('/aibot',aiBot);

module.exports = router;
