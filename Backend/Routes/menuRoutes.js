const express = require('express');
const router = express.Router();
const { addFood, getAllFood, updateFood, deleteFood, searchFood } = require('../Controllers/menuController');
const multer = require('multer');

//Image storage configuration
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer ({ storage: storage });

router.post('/add', upload.single("image"), addFood);
router.get('/list', getAllFood);
router.get('/search', searchFood);
router.put('/update/:id', upload.single('image'), updateFood);
router.delete('/delete/:id', deleteFood);


module.exports = router;