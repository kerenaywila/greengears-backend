// routes/bookingRoutes.js
const express = require("express");
const { createBooking, approveBooking, cancelBooking, deleteCanceledBooking, refundCancelBooking } = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/adminMiddleware");
const { validateBooking } = require("../middleware/auth");
const { paymentVerification } = require("../services/paymentVerification")


const router = express.Router();

// router.post("/verifyAdmin", verifyToken)

router.post("/bookings",  validateBooking, createBooking);         // Customer creates a booking
router.post("/bookings/approve",   isAdmin, approveBooking); // Admin approves a booking
router.post("/bookings/cancel",   cancelBooking);  // Admin/Customer cancels a booking
router.post("/bookings/delete",   deleteCanceledBooking);  // Admin/Customer cancels a booking


// Refund Route
router.post('/api/bookings/refund', refundCancelBooking);

// Payment Verification Route
router.post('/api/payments/verify', paymentVerification)

module.exports = router;
