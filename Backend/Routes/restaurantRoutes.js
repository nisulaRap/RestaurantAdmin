const express = require('express');
const router = express.Router();
const { addResturant, getAllResturants, getResturantById } = require('../Controllers/resturantController');
const multer = require('multer');

//Image storage configuration
const storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer ({ storage: storage });

router.post('/add', upload.single("resturantPhoto"), addResturant);
router.get('/list', getAllResturants);
router.get('/list/:id', getResturantById);

module.exports = router;