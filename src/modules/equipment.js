// models/Equipment.js

const mongoose = require("mongoose")
const Schema = mongoose.Schema


const equipmentSchema = new mongoose.Schema({
    name: String,
    type: String,
    brand: String,
    serialNumber: String,
    purchaseDate: Date,
    price: Number,
    description: String,
    location: String, 
});

const Equipment = mongoose.model("Equipment", equipmentSchema);
module.exports = Equipment
