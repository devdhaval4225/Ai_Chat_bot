const router = require('express').Router();
const { middAuth } = require("../middleware/auth");
const { 
    mediaModelProvider, 
    mediaFeatureProvider, 
    addMediaModel, 
    addMediaFeature 
} = require("../controller/media/mediaController");

// Get Routes
router.get('/models/getAll', mediaModelProvider);
router.get('/features/getAll', mediaFeatureProvider);

// Add Routes
router.post('/models/add', addMediaModel);
router.post('/features/add', addMediaFeature);

module.exports = router;
