const bcryptjs = require("bcryptjs")
// controllers/bookingController.js
const Booking = require("../models/booking");
const Farmer = require('../models/users');


// Create Booking
exports.createBooking = async (req, res) => {
  try {
    

    const {
      email,
      rental_id,
      customer_id,
      rental_frequency,
      equipment_type,
      rental_duration,
      rental_cost,
      customer_rating,
      rental_date,
      return_date,
      status} = req.body;
 // Validate email
 if (!email) {
  return res.status(400).json({ message: "Email is required" });
}

// Check if the customer exists in the database
const user = await Farmer.findOne({ email });
if (!user) {
  return res
    .status(400)
    .json({ message: "Please sign up to continue your booking" });
}
 
// Create the booking
const booking = await Booking.create({
  email,
  rental_id,
  customer_id: user.customer_id, // Use the ID of the found user
  rental_frequency,
  equipment_type,
  rental_duration,
  rental_cost,
  customer_rating,
  rental_date,
  return_date,
  status,
});

// Respond with success
res.status(201).json({
  message: "Booking created successfully",
  booking,
});
} catch (error) {
console.error("Error creating booking:", error.message); // Improved debugging log
res.status(500).json({
  message: "Error creating booking",
  error: error.message,
});
}
};
// Approve Booking
exports.approveBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, { status: "approved" }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking approved", booking });
  } catch (error) {
    res.status(500).json({ message: "Error approving booking", error });
  }
};

// Cancel Booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(id, { status: "canceled" }, { new: true });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json({ message: "Booking canceled", booking });
  } catch (error) {
    res.status(500).json({ message: "Error canceling booking", error });
  }
};
