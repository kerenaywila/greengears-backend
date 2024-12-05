const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  equipment_id: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});


//Add an index to improve query performance for equipment lookups
//reviewSchema.index({ equipment_id: 1 });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
