// routes/equipment.js
const express = require("express");
const { equipmentFxn } = require("../controllers/equipmentController");
const upload = require('../middleware/multer');
const Equipment = require('../models/equipment');

const router = express.Router();

// GET /api/equipment?page=1&limit=10&type=example&minPrice=100&maxPrice=500&location=NewYork
router.get("/equipment", equipmentFxn )
router.get("/single/equipment/:id", getSingleEquipment )

router.post('/equipment/:id/upload', upload, async (req, res) => {
    try {
      const equipment = await Equipment.findById(req.params.id);
  
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      const imageUrls = req.files.map(file => file.path);
  
      equipment.images.push(...imageUrls);
  
      await equipment.save();
  
      res.status(200).json({
        message: 'Images uploaded successfully',
        images: imageUrls
      });
    } catch (error) {
      res.status(500).json({error: error.message });
    }
  });
    


module.exports = router;
