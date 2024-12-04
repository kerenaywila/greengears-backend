const express = require("express");
const { equi_Search_Filter_Fxn, getSingleEquipment, createEquipment, updateEquipment, deleteEquipment, getEquipmentByCategory } = require("../controllers/equipmentController");
const {validateEquipmentUpdate} = require('../middleware/auth')
const upload = require("../utils/multerConfig"); // Image upload middleware

const router = express.Router();

// POST /api/equipment (Create new equipment)
// router.post("/equipment", upload.array('images', 5), createEquipment); // Allow up to 5 images
router.post("/create-equipment",  createEquipment); // Allow up to 5 images

// GET /api/equipment?page=1&limit=10&type=example&minPrice=100&maxPrice=500&location=NewYork
router.get("/equipment/pagination", equi_Search_Filter_Fxn);

// Get/search equipment
router.get("/get-equipment/:equipment_id", getSingleEquipment);

// Get/equipment by category
router.get("/equipment/category/:category", getEquipmentByCategory);

// PUT /api/equipment/:id (Update equipment)
// router.put("/equipment/:id", upload.array('images', 5), updateEquipment); // Allow up to 5 images
router.put("/equipment/update", validateEquipmentUpdate, updateEquipment); // Allow up to 5 images

// DELETE /api/equipment/:id (Delete equipment)
router.delete("/equipment/delete", deleteEquipment);

module.exports = router;
