// routes/equipment.js
const express = require("express");
const { equipmentFxn } = require("../controllers/equipmentController");

const router = express.Router();

// GET /api/equipment?page=1&limit=10&type=example&minPrice=100&maxPrice=500&location=NewYork
router.get("/equipment", equipmentFxn )
    
module.exports = router;
