const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Review = require("../models/reviews");
const Equipment = require("../models/equipment");

exports.createReview = async (req, res) => {
  try {
    const { farmer_id, equipment_id, rating, comment } = req.body;

    if (!farmer_id || !equipment_id || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    const review = new Review({ farmer_id, equipment_id, rating, comment });
    await review.save();

    res
      .status(201)
      .json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error adding review:",
        error: error.message,
      });
  }
};

exports.getEquipmentReviews = async (req, res) => {
  try {
    const { equipment_id } = req.params;

    if (!equipment_id) {
      return res
        .status(400)
        .json({ success: false, message: "Equipment ID is required" });
    }

    const equipment = await Equipment.findById(equipment_id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    const reviews = await Review.find({ equipment_id });

    res
      .status(200)
      .json({
        success: true,
        message: "Reviews retrieved successfully",
        data: reviews,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while fetching reviews",
        error: error.message,
      });
  }
};
