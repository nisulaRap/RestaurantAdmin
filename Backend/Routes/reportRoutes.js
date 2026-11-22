const express = require('express');
const router = express.Router();
const { generateReport } = require('../Controllers/reportController');

router.get('/download-report', generateReport);

module.exports = router;
