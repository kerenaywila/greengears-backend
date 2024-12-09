// const express = require('express');
// const axios = require('axios');
// const Booking = require("../models/booking");

// const PAYMENT_GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL;
// const PAYMENT_GATEWAY_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY;

// exports.paymentVerification = async (req, res) => {
//     if (!PAYMENT_GATEWAY_URL || !PAYMENT_GATEWAY_SECRET_KEY) {
//         return res.status(500).json({
//             status: 'error',
//             message: 'Payment gateway configuration is missing.',
//         });
//     }


//     const { transactionId, rental_cost } = req.body;

//     try {
//         const response = await axios.get(`${PAYMENT_GATEWAY_URL}/${transactionId}`, {
//             headers: {
//                 Authorization: `Bearer ${PAYMENT_GATEWAY_SECRET_KEY}`,
//             },
//             timeout: 5000,
//         });

//         const { data } = response;

//         if (data.status === 'success' && data.rental_cost === rental_cost) {
//             return res.status(200).json({
//                 status: 'success',
//                 message: 'Transaction verified successfully.',
//                 data: {
//                     transactionId: data.transaction_id,
//                     amount: data.rental_cost,
//                     currency: data.currency,
//                     verified: true,
//                 },
//             });
//         } else {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Transaction verification failed. Amount or status mismatch.',
//                 data: { verified: false },
//             });
//         }
//     } catch (error) {
//         console.error('Error verifying transaction:', error.message, error.response?.data);
//         return res.status(500).json({
//             status: 'error',
//             message: 'Internal server error. Please try again later.',
//             data: { verified: false },
//         });
//     }
// };

