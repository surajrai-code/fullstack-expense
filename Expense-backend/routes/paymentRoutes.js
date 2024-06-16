const express = require('express');
const paymentController= require('../controller/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create-order', authMiddleware, paymentController.createOrder);
router.post('/verify-payment', authMiddleware, paymentController.verifyPayment);

module.exports = router;
