const bcryptjs = require("bcryptjs")
// controllers/bookingController.js
const Booking = require("../models/booking");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { rentalId, customerId, startDate, endDate } = req.body;
    const booking = await Booking.create({ rentalId, customerId, startDate, endDate });
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error });
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
