const express = require('express');
const router = express.Router();
const { getDashboardStats, getPopularMenuItems, getOrderTrends } = require('../Controllers/dashboardController');

router.get('/stats', getDashboardStats);
router.get('/popular-menu-items', getPopularMenuItems);
router.get('/order-trends', getOrderTrends);

module.exports = router;
