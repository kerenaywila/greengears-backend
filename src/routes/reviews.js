const express = require("express");
const {getEquipmentReviews, addReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/create-review", addReview);
router.get('/get-reviews/:equipment_id', getEquipmentReviews);


module.exports = router;
