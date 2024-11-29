const mongoose = require("mongoose");
const Schema = mongoose.Schema

const reviewSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true }, 
  equipment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment", required: true }, 
  rating: { type: Number, min: 1, max: 5, required: true }, 
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports =  Review;
