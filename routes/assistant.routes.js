const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { assistanceProvider } = require("../controller/assistance/assistance");
const { assistanceViaCategory } = require("../controller/assistance/assistanceViaCategory");
const { runAssi } = require("../controller/assistance/runAssitant");
const { runAssiV1 } = require("../controller/assistance/runAssitantV1");


router.get('/getcategoory/:id', assistanceProvider);
router.get('/categoory', assistanceViaCategory);
router.post('/runassi/:id', middAuth, runAssi);
router.post('/runassiv1/:id', middAuth, runAssiV1);

module.exports = router;
