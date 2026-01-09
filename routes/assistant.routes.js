const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { assistanceProvider } = require("../controller/assistance/assistance");
const { assistanceViaCategory } = require("../controller/assistance/assistanceViaCategory");
const { 
    getAssistantsV2,
    getCharactersV2,
    getAssistantCategories, 
    getCharacterCategories 
} = require("../controller/assistance/assistanceViaCategory2");
const { runAssi } = require("../controller/assistance/runAssitant");
const { runAssiV1 } = require("../controller/assistance/runAssitantV1");


router.get('/getcategoory/:id', assistanceProvider);
router.get('/categoory', assistanceViaCategory);
router.get('/v1/assistant', getAssistantsV2);
router.get('/v1/character', getCharactersV2);

// New Routes for Categories
router.get('/categories/assistant', getAssistantCategories);
router.get('/categories/character', getCharacterCategories);

router.post('/runassi/:id', middAuth, runAssi);
router.post('/runassiv1/:id', middAuth, runAssiV1);

module.exports = router;
