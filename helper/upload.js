const multer = require('multer');
const path = require('path');
const fs = require('fs');

//set  storage engine
const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() +
            path.extname(file.originalname));
    }
});


//init uploads
const upload = multer({
    storage: storage,
    limits: {
        // fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1
    },
}).single('image');

module.exports = { upload };