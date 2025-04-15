const express = require('express');
const { login, logout, register, checkToken } = require('../Controllers/userController');
const upload = require('../Middleware/multerConfig');

const router = express.Router();

router.post('/register', upload.single('photo'), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/checkToken', checkToken);

module.exports = router;
