// routes/equipment.js
const express = require("express");
const { equipmentFxn, getSingleEquipment } = require("../controllers/equipmentController");
const upload = require("../utils/multerConfig");

const router = express.Router();

// GET /api/equipment?page=1&limit=10&type=example&minPrice=100&maxPrice=500&location=NewYork
router.get("/equipment", equipmentFxn )
router.get("/single/equipment/:id", getSingleEquipment)
    

module.exports = router;
