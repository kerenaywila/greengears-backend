// models/Equipment.js

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const equipmentSchema = new mongoose.Schema({
  equipment_id: { type: String, required: true },
  type: { type: String, required: true },         // Type of equipment, e.g., tractor, plow
  brand: { type: String, required: true },        // Brand of the equipment
  model: { type: String, required: true },  
  price:  { type: Number, required: true },   // Model name or number
  purchase_date: { type: Date, required: true },
  description: { type: String, required: true },
  current_condition: { type: String, enum: ['good', 'needs repair', 'excellent'], required: true }, // e.g., 'good', 'needs repair', 'excellent'
  available: { type: Boolean, required: true, default: true},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});



const EquipmentRentalHistorySchema = new mongoose.Schema({
  rental_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  equipment_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Foreign key linking to Equipment
  rental_frequency: { type: Number, required: true }, // Number of rentals for this equipment
  rental_duration: { type: Number, required: true }, // Total rental duration in days or weeks
  revenue_generated: { type: Number, required: true }, // Total revenue generated from this equipment
  maintenance_costs: { type: Number, required: true }, // Total maintenance costs over time

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});


const GeographicLocationSchema = new mongoose.Schema({

  equipment_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Foreign key linking to Equipment
  storage_location: { type: String, required: true }, // Permanent storage location of the equipment
  delivery_location: { type: String, required: true }, // Delivery or pickup location for rentals
  pickup_location: { type: String, required: true }, // Pickup location if different from delivery
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);
const EquipmentRentalHistory = mongoose.model("EquipmentRentalHistory", EquipmentRentalHistorySchema);
const GeographicLocation = mongoose.model("GeographicLocation", GeographicLocationSchema);

module.exports = {Equipment, EquipmentRentalHistory, GeographicLocation } 
