const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Review = require('../models/reviews');
const Equipment = require("../models/equipment");

exports.createReview = async (req, res) => {
  try {
    const { farmer_id, equipment_id, rating, comment } = req.body;

    if (!farmer_id || !equipment_id || !rating) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Check if the equipment exists
    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return res.status(404).json({ success: false, message: "Equipment not found" });
    }

    // Save the review
    const review = new Review({ farmer_id, equipment_id, rating, comment });
    await review.save();

    res.status(201).json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};

exports.getReviewsForEquipment = async (req, res) => {
  try {
    const { equipment_id } = req.params;

    // Fetch reviews for the given equipment
    const reviews = await Review.find({ equipment_id }).populate("farmer_id", "name");
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "An error occurred", error: error.message });
  }
};
