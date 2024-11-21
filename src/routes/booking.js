// routes/bookingRoutes.js
const express = require("express");
const { createBooking, approveBooking, cancelBooking } = require("../controllers/bookingController");
const { verifyToken, isAdmin } = require("../middleware/adminMiddleware");
const { validateBooking } = require("../middleware/auth");



const router = express.Router();

// router.post("/verifyAdmin", verifyToken)

router.post("/bookings",  validateBooking, createBooking);         // Customer creates a booking
router.put("/bookings/:id/approve",   isAdmin, approveBooking); // Admin approves a booking
router.put("/bookings/:id/cancel",  isAdmin, cancelBooking);  // Admin/Customer cancels a booking

module.exports = router;
