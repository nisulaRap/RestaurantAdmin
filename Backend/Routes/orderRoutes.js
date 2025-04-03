const express = require('express');
const router = express.Router();
const { createOrder, listOrders, updateStatus } = require('../Controllers/orderController');

router.post('/add', createOrder);
router.get('/list', listOrders);
router.put("/:orderId/status", updateStatus);

module.exports = router;