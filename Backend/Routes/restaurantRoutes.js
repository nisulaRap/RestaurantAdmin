const express = require('express');
const router = express.Router();
const { addRestaurant, getAllRestaurants, getRestaurantById, updateRestaurant, deleteRestaurant, searchRestaurant } = require('../Controllers/restaurantController');
const multer = require('multer');

// Image storage configuration
const storage = multer.diskStorage({
    destination: "uploads",
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single("restaurantPhoto"), addRestaurant);
router.get('/list', getAllRestaurants);
router.get('/list/:id', getRestaurantById);
router.get('/search', searchRestaurant);
router.put('/update/:id', upload.single("restaurantPhoto"), updateRestaurant);
router.delete('/delete/:id', deleteRestaurant);

module.exports = router;
