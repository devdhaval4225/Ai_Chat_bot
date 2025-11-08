const router = require('express').Router();
// const {middAuth} = require("../middleware/auth");
const { tokenAndModel } = require("../controller/assistance/assistance");
const { updateToken } = require("../controller/manageTokens/update");


router.post('/gettokens',tokenAndModel);
router.post('/updatetokens',updateToken);

module.exports = router;
