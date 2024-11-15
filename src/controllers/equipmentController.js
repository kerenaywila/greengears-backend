const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")

const Equipment = require("../models/equipment");

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
