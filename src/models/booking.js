// models/Booking.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema

const rentalSchema = new mongoose.Schema({
      
      rental_id: { type: String, required: true },
      customer_id: { type: String, required: true }, // Foreign key linking to Customer
      // rental_frequency: { type: Number, required: true }, // Number of times customer rents equipment
      equipment_id: { type: String, required: true },
      location: {
      contactNumber: { type: String, required: true },
      state: { type: String, required: true },
      address: { type: String, required: true },
        },
      deliveryDetail: {
        stationPickUp :{type: Boolean,  default: true},
        doorPickUp:{type: String, }
      },
      rental_duration: { type: Number, required: true }, // Duration in days or weeks
      rental_cost: { type: Number, required: true , min: 0}, // Total cost of the rental
      // customer_rating: { type: Number, required: true }, // Rating given by customer, e.g., out of 5
      rental_date: { type: Date, required: true },
      return_date: {
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    return value > this.rental_date;
                },
                message: "Return date must be after rental date.",
            },
        },
        transactionId: { type: String },
       
        reason: { type: String }, // Optional field
        status: { 
            type: String, 
            enum: ["pending", "approved", "canceled", "returned", "overdue", "in-progress"], 
            default: "approved" 
        },

        payment_status: { 
            type: String, 
            enum: ["pending", "successful", "canceled", ], 
            default: "pending" 
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

const RentalHistory = mongoose.model("RentalHistory", rentalSchema);
module.exports = RentalHistory;