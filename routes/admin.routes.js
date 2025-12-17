const router = require('express').Router();
const { verifyAdmin } = require("../middleware/admin.auth");
const { login } = require("../controller/admin/auth/login");

const { allModel } = require("../controller/admin/model/model");
const { updateModel } = require("../controller/admin/model/updateModel");

const { assistance } = require("../controller/admin/assistance/getAssistance");
const { updateAssistance } = require("../controller/admin/assistance/updateAssistance");

const { tools } = require("../controller/admin/tools/getTool");
const { updateTool } = require("../controller/admin/tools/updateTool");


router.post('/login',login);

// Model
router.get('/model', verifyAdmin, allModel);
router.post('/model/:id', verifyAdmin, updateModel);

// Assistance
router.get('/assistance', verifyAdmin, assistance);
router.post('/assistance/:id', verifyAdmin, updateAssistance);

// Tool
router.get('/tool', verifyAdmin, tools);
router.post('/tool/:id', verifyAdmin, updateTool);


module.exports = router;
