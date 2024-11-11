// models/Booking.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema

const bookingSchema = new mongoose.Schema({
  rentalId: { type: mongoose.Schema.Types.ObjectId, required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  status: { type: String, enum: ["pending", "approved", "canceled"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports =  Booking;
