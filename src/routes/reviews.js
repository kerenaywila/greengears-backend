const express = require("express");
const { createReview, getReviewsForEquipment } = require("../controllers/reviewController");

const router = express.Router();

router.post("/create-review", createReview);
router.get("/get-review:equipment_id", getReviewsForEquipment);

module.exports = router;
