const express = require("express");
const { equipmentFxn, getSingleEquipment, createEquipment, updateEquipment, deleteEquipment } = require("../controllers/equipmentController");
const upload = require("../utils/multerConfig"); // Image upload middleware

const router = express.Router();

// GET /api/equipment?page=1&limit=10&type=example&minPrice=100&maxPrice=500&location=NewYork
router.get("/equipment", equipmentFxn);

// GET /api/single/equipment/:id
router.get("/single/equipment/:id", getSingleEquipment);

// POST /api/equipment (Create new equipment)
router.post("/equipment", upload.array('images', 5), createEquipment); // Allow up to 5 images

// PUT /api/equipment/:id (Update equipment)
router.put("/equipment/:id", upload.array('images', 5), updateEquipment); // Allow up to 5 images

// DELETE /api/equipment/:id (Delete equipment)
router.delete("/equipment/:id", deleteEquipment);

module.exports = router;
