const bcryptjs = require("bcryptjs")
const Booking = require("../models/booking");
const Farmer = require("../models/users");

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const {
      customer_id,
      rental_id,
      rental_frequency,
      equipment_type,
      rental_duration,
      rental_cost,
      customer_rating,
      rental_date,
      return_date,
      status,
    } = req.body;

  

    // Check for overlapping bookings (specific to rental_id)
    const conflictingBooking = await Booking.findOne({
      rental_id,
      $or: [
        { rental_date: { $lte: return_date, $gte: rental_date } },
        { return_date: { $gte: rental_date, $lte: return_date } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({
        message: "The equipment is already booked for the selected dates.",
      });
    }

    // Create the booking
    const booking = await Booking.create({
      
      rental_id,
      customer_id, // Use the ID of the found user
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
    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error.message); // Improved debugging log
    return res.status(500).json({
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
