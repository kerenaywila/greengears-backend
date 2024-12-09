// routes/bookingRoutes.js
const express = require("express");
const { createBooking, cancelBooking, deleteCanceledBooking, addToCart, refundCancelBooking } = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/adminMiddleware");
const { validateBooking } = require("../middleware/auth");
// const { paymentVerification } = require("../services/paymentVerification")


const router = express.Router();

// router.post("/verifyAdmin", verifyToken)

// Booking Route
router.post("/bookings",  validateBooking, createBooking);         // Customer creates a booking
// router.post("/bookings/approve",   isAdmin, approveBooking); // Admin approves a booking
router.post("/bookings/cancel",   cancelBooking);  // Admin/Customer cancels a booking
router.post("/bookings/delete",   deleteCanceledBooking);  // Admin/Customer cancels a booking

// Adding to cart route
router.post("/cart/add", addToCart);


// Refund Route
router.post('/bookings/refund', refundCancelBooking);

// // Payment Verification Route
// router.post('/payments/verify', paymentVerification)

module.exports = router;
