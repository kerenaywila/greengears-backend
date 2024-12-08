const bcryptjs = require("bcryptjs")
const Equipment = require("../models/equipment");
const upload = require("../utils/multerConfig");
const fs = require("fs");

// Create new equipment listing (with images, pricing, availability)
exports.createEquipment = async (req, res) => {
  try {
    const {
      product_name,
      product_details,
      specification,
      features,
      categories,
      price,
      available,
    } = req.body;

    // Validate required fields
    if (
      !product_name ||
      !product_details ||
      !specification ||
      !features ||
      !categories ||
      !price
    ) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Parse and validate inputs
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ message: "Price must be a valid positive number." });
    }

    const parsedAvailable = available === "true" || available === true;

    // Handle images
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Generate unique equipment ID
    const generateEquipmentID = async () => {
      const existingIDs = await Equipment.distinct("equipment_id");
      const numbers = "0123456789";
      let newID;
      do {
        newID = `SN${Array.from({ length: 5 }, () =>
          numbers.charAt(Math.floor(Math.random() * numbers.length))
        ).join("")}`;
      } while (existingIDs.includes(newID));
      return newID;
    };

    const equipment_id = await generateEquipmentID();

    // Create and save the equipment document
    const newEquipment = new Equipment({
      equipment_id,
      product_name,
      product_details,
      specification,
      features,
      categories,
      price: parsedPrice,
      available: parsedAvailable,
      images,
    });

    await newEquipment.save();

    // Return success response
    return res.status(201).json({
      message: "Equipment created successfully",
      data: newEquipment,
    });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "An error occurred while creating the equipment.", error: error.message });
  }
};

exports.equi_Search_Filter_Fxn = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Destructure query parameters
    const {
      product_name,
      categories,
      price,
      minPrice,
      maxPrice,
      available
    } = req.query;

    // Initialize filters
    const filters = {};

    // Add filters based on provided query parameters
    if (product_name) filters.product_name = new RegExp(product_name, "i"); // Case-insensitive search

    // Parse and filter by price or price range
    if (price) {
      const parsedPrice = parseFloat(price);
      if (!isNaN(parsedPrice)) filters.price = parsedPrice;
    } else if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseFloat(minPrice);
      if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    }

    // Filter by categories
    if (categories) filters.categories = new RegExp(categories, "i");

  // Filter by available in stock
  if (available) filters.available = available;
  
    // Retrieve filtered and paginated equipment list
    const equipmentList = await Equipment.find(filters).skip(skip).limit(limit);
    const totalItems = await Equipment.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / limit);

    // Response with paginated results
    res.status(200).json({
      page,
      totalPages,
      limit,
      totalItems,
      equipmentList,
    });
  } catch (error) {
    console.error("Error in equi_Search_Filter_Fxn:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// get single equipment details by IDexports.getSingleEquipment = async (req, res) => {
  exports.getSingleEquipment = async (req, res) => {
    try {
      const { equipment_id } = req.body; 
  
      // Validate input
      if (!equipment_id) {
        return res.status(400).json({ message: 'Equipment ID is required' });
      }
  
      // Find equipment by its ID
      const equipment = await Equipment.findOne({ equipment_id }); 
  
      // If equipment is not found, return a 404 response
      if (!equipment) {
        return res.status(404).json({ message: 'Equipment not found' });
      }
  
      // Send a success response
      res.status(200).json({
        message: 'Equipment details retrieved successfully',
        data: equipment,
      });
    } catch (error) {
      // Log the error and send a generic error response
      console.error(error);
      res.status(500).json({ message: 'An internal server error occurred' });
    }
  };
  
  //Get equipments by category
exports.getEquipmentByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Get the category from the request parameters

    // Check if category is valid
    const validCategories = [
      "Tractor Equipment",
      "Tillage Equipment",
      "Harvesting Equipment",
      "Irrigation Equipment",
      "Soil Preparation",
      "Grain Storage",
      "Utility vehicles",
      "Precision Farming",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({ error: "Invalid category specified" });
    }

    const equipments = await Equipment.find({ categories: category });

    if (equipments.length === 0) {
      return res.status(404).json({ message: "No equipment found in this category" });
    }

    res.status(200).json({ message: 'Equipments retrieved successfully', equipments });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while fetching equipment by category", error: error.message });
  }
};


exports.updateEquipment = async (req, res) => {
  try {
    const { 
      equipment_id,
      product_name,
      product_details,
      categories,
      price,
      available 
    } = req.body;

    // Handle file uploads
    const images = req.files ? req.files.map(file => file.path) : [];

    // Validate equipment ID and existence
    const equipment = await Equipment.findOne({equipment_id});
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Update fields only if provided
    if (product_name !== undefined) equipment.product_name = product_name;
    if (product_details !== undefined) equipment.product_details = product_details;
    if (categories !== undefined) equipment.categories = categories;
    if (price !== undefined) equipment.price = price;
    if (available !== undefined) equipment.available = available;
    if (images.length > 0) equipment.images = images;

    // Save the updated equipment
    await equipment.save();

    res.status(200).json({
      message: "Equipment updated successfully", equipment});
  } catch (error) {
    console.error("Error updating equipment:", error);
    res.status(500).json({ message: "Error updating equipment", error });
  }
};


// Delete existing equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const {equipment_id} = req.body;

    const equipment = await Equipment.findOne({equipment_id});

    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    // Delete equipment images from file system (if necessary)
    // if (equipment.images.length > 0) {
    //   equipment.images.forEach(imagePath => {
    //     fs.unlink(imagePath, (err) => {
    //       if (err) console.log("Error deleting image file", err);
    //     });
    //   });
    // }

    await equipment.deleteOne();
    res.status(200).json({
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting equipment", error });
  }
};

