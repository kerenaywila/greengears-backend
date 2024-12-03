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
      price   
    } = req.body;


    // Validate required fields
    if (!product_name 
      || !product_details 
      || !specification.engine_power 
      || !specification.engine_type
      || !specification.transmission
      || !specification.PTO_power
      || !specification.hydraulic_system
      || !specification.fuel_tank_Capacity
      || !specification.weight
      || !features.power_efficiency 
      || !features.versatility
      || !features.enhanced_visibility
      || !features.comfort_n_ergonomics      
      || !categories 
      || !price) 
      {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Parse and validate inputs
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Price must be a valid number." });
    }

    // const parsedDate = new Date(purchase_date);
    // if (isNaN(parsedDate.getTime())) {
    //   return res.status(400).json({ message: "Purchase date must be a valid date." });
    // }
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Fetch existing IDs to avoid duplicates
    const existingIDs = await Equipment.distinct("equipment_id");

    // Generate a unique equipment ID
    const generateEquipmentID = async () => {
      const numbers = "0123456789";
      let newID;
      do {
        const randomNumbers = Array.from({ length: 5 }, () =>
          numbers.charAt(Math.floor(Math.random() * numbers.length))
        ).join("");
        newID = `SN${randomNumbers}`;
      } while (existingIDs.includes(newID));
      return newID;
    };

    const equipment_id = await generateEquipmentID();

    // Create new equipment document
    const newEquipment = new Equipment({
      equipment_id,
      product_name, 
      product_details,
      specification, 
      features, 
      categories,
      price,
     
      available: available === "true" || available === true,
      images,
    });

    // Save to the database
    await newEquipment.save();

    // Return success response
    res.status(201).json({
      message: "Equipment created successfully",
      data: newEquipment,
    });
  } catch (error) {
    console.error("Error creating equipment:", error);
    res.status(500).json({ message: "Error creating equipment", error: error.message });
  }
};

exports.equi_Search_Filter_Fxn = async (req, res) => {
try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search and filter conditions
    const { product_name, specification, features, categories,price} = req.query;
    const filters = {};

    // Filter by type
    if (product_name) {
        filters.product_name = product_name;
    }

     // Filter by price
     if (price) {
      filters.price = parseFloat(price);
  }

  // Filter by Engine Power specification
    if (specification.engine_power) {
        filters.specification.engine_power = specification.engine_power;
    }
  // Filter by Engine Type specification
    if (specification.engine_type) {
      filters.specification.engine_type = specification.engine_type;
  }
  // Filter by transmission specification
    if (specification.transmission) {
      filters.specification.transmission = specification.transmission;
  }

   // Filter by PTO Power specification
   if (specification.PTO_power) {
    filters.specification.PTO_power = specification.PTO_power;
}
   // Filter by hydraulic_system specification
   if (specification.hydraulic_system) {
    filters.specification.hydraulic_system = specification.hydraulic_system;
}

   // Filter by fuel_tank_Capacity specification
   if (specification.fuel_tank_Capacity) {
    filters.specification.fuel_tank_Capacity = specification.fuel_tank_Capacity;
}
   // Filter by weight specification
   if (specification.weight) {
    filters.specification.weight = specification.weight;
}

!features.power_efficiency 
      || !features.versatility
      || !features.enhanced_visibility
      || !features.comfort_n_ergonomics 
  // Filter by power_efficiency features
  if (features.power_efficiency) {
    filters.features.power_efficiency = features.power_efficiency;
}
  // Filter by versatility features
  if (features.versatility) {
    filters.features.versatility = features.versatility;
}
  // Filter by enhanced_visibility features
  if (features.enhanced_visibility) {
    filters.features.enhanced_visibility = features.enhanced_visibility;
}

  // Filter by comfort_n_ergonomics features
  if (features.comfort_n_ergonomics) {
    filters.features.comfort_n_ergonomics = features.comfort_n_ergonomics;
}
  // Filter by brand
    if (categories) {
        filters.categories = categories;
    }
   // Filter by current_condition
    if (current_condition) {
        filters.current_condition = current_condition;
    }
     // Filter by description
     if (description) {
      filters.description = description;
  }


    // // Filter by price range
    // if (minPrice || maxPrice) {
    //     filters.price = {};
    //     if (minPrice) filters.price.$gte = parseFloat(minPrice);
    //     if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
    // }

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
  

exports.updateEquipment = async (req, res) => {
  try {
    const { 
      equipment_id,
      type, 
      brand, 
      model, 
      price, 
      description, 
      current_condition, 
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
    if (type !== undefined) equipment.type = type;
    if (brand !== undefined) equipment.brand = brand;
    if (model !== undefined) equipment.model = model;
    if (price !== undefined) equipment.price = price;
    if (description !== undefined) equipment.description = description;
    if (current_condition !== undefined) equipment.current_condition = current_condition;
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
    if (equipment.images.length > 0) {
      equipment.images.forEach(imagePath => {
        fs.unlink(imagePath, (err) => {
          if (err) console.log("Error deleting image file", err);
        });
      });
    }

    await equipment.deleteOne();
    res.status(200).json({
      message: "Equipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting equipment", error });
  }
};

