const express = require('express');
const router = express.Router();
const { addResturant, getAllResturants, getResturantById, updateResturant, deleteResturant } = require('../Controllers/resturantController');
const multer = require('multer');

// Image storage configuration
const storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single("resturantPhoto"), addResturant);
router.get('/list', getAllResturants);
router.get('/list/:id', getResturantById);
router.put('/update/:id', upload.single("resturantPhoto"), updateResturant);
router.delete('/delete/:id', deleteResturant);

module.exports = router;
