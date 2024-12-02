const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  equipment_id: { type: String, unique: true, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});


//Add an index to improve query performance for farmer and equipment lookups
reviewSchema.index({ farmer_id: 1, equipment_id: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
