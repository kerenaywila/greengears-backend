// models/Booking.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema

const rentalSchema = new mongoose.Schema({
      rental_id: { type: mongoose.Schema.Types.ObjectId, required: true },
      customer_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Foreign key linking to Customer
      rental_frequency: { type: Number, required: true }, // Number of times customer rents equipment
      equipment_type: { type: String, required: true },
      rental_duration: { type: Number, required: true }, // Duration in days or weeks
      rental_cost: { type: Number, required: true }, // Total cost of the rental
      customer_rating: { type: Number, required: true }, // Rating given by customer, e.g., out of 5
      rental_date: { type: Date, required: true },
      return_date: { type: Date, required: true },
      status: { type: String, enum: ["pending", "approved", "canceled"], default: "pending" },
      createdAt: { type: Date, default: Date.now },
});

const RentalHistory = mongoose.model("RentalHistory", rentalSchema);
module.exports =  RentalHistory;
