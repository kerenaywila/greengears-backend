// models/Equipment.js

const mongoose = require("mongoose")
const Schema = mongoose.Schema


const equipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
    serialNumber: {type: String},
    purchaseDate: {type: Date},
    price: { type: Number, required: true },
    available: { type: Boolean, default: true },
    description: { type: String },
    location: { type: String },
    images: [{ type: String }],  // Array of image URLs 
});

// Indexing for faster queries
equipmentSchema.index({ price: 1, location: 1 });

const Equipment = mongoose.model("Equipment", equipmentSchema);
module.exports = Equipment
