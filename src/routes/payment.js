// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { generatePaymentLink, verifyPayment, sendReminderEmail } = require('../services/paymentContrl');

// Define routes
router.post('/payment/link', generatePaymentLink);
router.post('/payment/verify', verifyPayment);
router.post('/payment/reminder', sendReminderEmail);



module.exports = router;