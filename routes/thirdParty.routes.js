const router = require('express').Router();

const { provider } = require("../controller/thirdPartyProvider/apiProvider");
const { aiBot } = require("../controller/thirdPartyProvider/openAiBot");
const { pdfSummaryBot } = require("../controller/thirdPartyProvider/pdfSummaryBot");
const { upload } = require("../helper/upload");
const {middAuth} = require("../middleware/auth");


router.post('/provider',middAuth,provider);
router.post('/aibot',middAuth,aiBot);
router.post('/pdfsummary',upload,middAuth,pdfSummaryBot);

module.exports = router;
