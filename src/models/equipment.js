// models/Equipment.js

const mongoose = require("mongoose")
const Schema = mongoose.Schema

const equipmentSchema = new mongoose.Schema({
  equipment_id: { type: String, unique: true, required: true },
  product_name: { type: String, required: true },
  product_details: { type: String, required: true },
  specification: {
    engine_power: { type: String, required: true },
    engine_type: { type: String, required: true },
    transmission: { type: String, required: true },
    PTO_power: { type: String, required: true },
    hydraulic_system: { type: String, required: true },
    fuel_tank_Capacity: { type: String, required: true },
    weight: { type: String, required: true },
  },
  features: {
    power_efficiency: { type: String, required: true },
    versatility: { type: String, required: true },
    enhanced_visibility: { type: String, required: true },
    comfort_n_ergonomics: { type: String, required: true },
  },
  categories: { 
    type: String, 
    enum: ["Tractor Equipment", "Tillage Equipment", "Harvesting Equipment", "Irrigation Equipment", "Soil Preparation","Grain Storage", "Utility vehicles", "Precision Farming"], 
    required: true},
  price:  { type: Number, required: true },   

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

  // purchase_date: { type: Date, required: true },
// description: { type: String, required: true, default: Date.now },
  // current_condition: { type: String, enum: ['good', 'needs repair', 'excellent'], required: true }, // e.g., 'good', 'needs repair', 'excellent'

// const EquipmentRentalHistorySchema = new mongoose.Schema({
//   rental_id: { type: mongoose.Schema.Types.ObjectId, required: true },
//   equipment_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Foreign key linking to Equipment
//   rental_frequency: { type: Number, required: true }, // Number of rentals for this equipment
//   rental_duration: { type: Number, required: true }, // Total rental duration in days or weeks
//   revenue_generated: { type: Number, required: true }, // Total revenue generated from this equipment
//   maintenance_costs: { type: Number, required: true }, // Total maintenance costs over time

//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });


// const GeographicLocationSchema = new mongoose.Schema({

//   equipment_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Foreign key linking to Equipment
//   storage_location: { type: String, required: true }, // Permanent storage location of the equipment
//   delivery_location: { type: String, required: true }, // Delivery or pickup location for rentals
//   pickup_location: { type: String, required: true }, // Pickup location if different from delivery
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

const Equipment = mongoose.model("Equipment", equipmentSchema);
// const EquipmentRentalHistory = mongoose.model("EquipmentRentalHistory", EquipmentRentalHistorySchema);
// const GeographicLocation = mongoose.model("GeographicLocation", GeographicLocationSchema);

module.exports = Equipment
