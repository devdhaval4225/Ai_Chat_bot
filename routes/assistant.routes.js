const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { assistanceProvider } = require("../controller/assistance/assistance");
const { assistanceViaCategory } = require("../controller/assistance/assistanceViaCategory");
const { runAssi } = require("../controller/assistance/runAssitant");


router.get('/getcategoory/:id', assistanceProvider);
router.get('/categoory', assistanceViaCategory);
router.post('/runassi/:id', middAuth, runAssi);

module.exports = router;
