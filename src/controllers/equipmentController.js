const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Equipment = require("../models/equipment");
const upload = require("../utils/multerConfig");
const fs = require("fs");

exports.equipmentFxn = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search and filter conditions
    const { type, minPrice, maxPrice, location } = req.query;
    const filters = {};

    // Filter by type
    if (type) {
        filters.type = type;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        filters.price = {};
        if (minPrice) filters.price.$gte = parseFloat(minPrice);
        if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Filter by location
    if (location) {
        filters.location = location;
    }

    // Retrieve filtered and paginated equipment list
    const equipmentList = await Equipment.find(filters).skip(skip).limit(limit);
    const totalItems = await Equipment.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
        page,
        totalPages,
        limit,
        totalItems,
        equipmentList,
    });
} catch (error) {
    res.status(500).json({ message: "Server Error", error });
}
};

// get single equipment details by ID
exports.getSingleEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(400).json({ message: 'Equipment not found' });
    }

    res.status(200).json({
      message: 'Equipment details retrieved successfully',
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};



// Create new equipment listing (with images, pricing, availability)
exports.createEquipment = async (req, res) => {
  try {
    const { name, type, brand, serialNumber, purchaseDate, price, description, location, available } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const newEquipment = new Equipment({
      name,
      type,
      brand,
      serialNumber,
      purchaseDate,
      price,
      available,
      description,
      location,
      images,
    });

    await newEquipment.save();
    res.status(201).json({
      message: "Equipment created successfully",
      data: newEquipment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating equipment", error });
  }
};

// Update existing equipment (with images, pricing, availability)
exports.updateEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;
    const { name, type, brand, serialNumber, purchaseDate, price, description, location, available } = req.body;
    const images = req.files ? req.files.map(file => file.path) : [];

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    equipment.name = name || equipment.name;
    equipment.type = type || equipment.type;
    equipment.brand = brand || equipment.brand;
    equipment.serialNumber = serialNumber || equipment.serialNumber;
    equipment.purchaseDate = purchaseDate || equipment.purchaseDate;
    equipment.price = price || equipment.price;
    equipment.available = available || equipment.available;
    equipment.description = description || equipment.description;
    equipment.location = location || equipment.location;
    equipment.images = images.length ? images : equipment.images;

    await equipment.save();
    res.status(200).json({
      message: "Equipment updated successfully",
      data: equipment,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating equipment", error });
  }
};

// Delete existing equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const equipmentId = req.params.id;

    const equipment = await Equipment.findById(equipmentId);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Delete equipment images from file system (if necessary)
    if (equipment.images.length > 0) {
      equipment.images.forEach(imagePath => {
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Error deleting image file", err);
        });
      });
    }

    await equipment.remove();
    res.status(200).json({
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting equipment", error });
  }
};

