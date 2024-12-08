// models for Adding to cart
const mongoose = require("mongoose");

const addToCartSchema = new mongoose.Schema({
    customer_id: { type: String, required: true, unique: true },
    items: [
      {
        equipment_id: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
    createdAt: {
        type: Date,
        default: Date.now,
      }, // Automatically adds createdAt and updatedAt
    });

const Add_To_Cart = mongoose.model("Add_To_Cart", addToCartSchema);
module.exports = Add_To_Cart;
 
  