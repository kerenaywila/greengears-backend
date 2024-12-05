const Review = require("../models/reviews");
const Equipment = require("../models/equipment");
const Farmer = require('../models/users');

exports.addReview = async (req, res) => {
  try {
    const { customer_id, equipment_id, rating, comment } = req.body;

    // Validate input
    if (!customer_id || !equipment_id || !rating) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    //validate user
    const user = await Farmer.findOne({ customer_id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const equipment = await Equipment.findOne({ equipment_id });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    const newReview = new Review({
      customer_id,
      equipment_id,
      rating,
      comment,
    });

    await newReview.save();

    res.status(201).json({ success: true, message: "Review added successfully.", review: newReview });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ success: false, message: "Error adding review.", error: error.message });
  }
};


exports.getEquipmentReviews = async (req, res) => {
  try {
    const { equipment_id } = req.params;

    // Validate input
    if (!equipment_id) {
      return res.status(400).json({ success: false, message: "Equipment ID is required." });
    }

    // Fetch reviews for the given equipment
    const reviews = await Review.find({ equipment_id });

    // Check if reviews exist
    if (reviews.length === 0) {
      return res.status(404).json({ success: false, message: "No reviews found for this equipment." });
    }

    // Respond with the reviews
    res.status(200).json({
      success: true,
      message: "Reviews retrieved successfully.",
      data: reviews,
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, message: "Error fetching reviews.", error: error.message });
  }
};
