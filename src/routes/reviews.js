const express = require("express");
const { createReview, getEquipmentReviews } = require("../controllers/reviewController");

const router = express.Router();

router.post("/create-review", createReview);
router.get('/reviews/:equipment_id', getEquipmentReviews);


module.exports = router;
