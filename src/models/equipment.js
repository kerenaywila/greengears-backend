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
    enum: ["Tractor", "Tillage", "Haversting Eqipment", "Irrigation Equipment", "Soil Preparation","Grain Storage", "Utility vehicles"], 
    required: true},
  price:  { type: Number, required: true },   
  button: { type: String, default: 'Rent Now'},

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
// Pre-save hook to validate or adjust the data before saving

equipmentSchema.pre("save", function (next) {
  // Transform specification fields if necessary
  if (this.specification.engine_power) {
    this.specification.engine_power = this.specification.engine_power.trim(); // Example transformation
  }
  if (this.specification.engine_type) {
    this.specification.engine_type = this.specification.engine_type.trim(); // Example transformation
  }  
  if (this.specification.transmission) {
    this.specification.transmission = this.specification.transmission.trim(); // Example transformation
  }  
  if (this.specification.PTO_power) {
    this.specification.PTO_power = this.specification.PTO_power.trim(); // Example transformation
  }  
  if (this.specification.hydraulic_system) {
    this.specification.hydraulic_system = this.specification.hydraulic_system.trim(); // Example transformation
  }
  if (this.specification.fuel_tank_Capacity) {
    this.specification.fuel_tank_Capacity = this.specification.fuel_tank_Capacity.trim(); // Example transformation
  }
  if (this.specification.weight) {
    this.specification.weight = this.specification.weight.trim(); // Example transformation
  }


  // Transform features fields if necessary
  if (this.features.power_efficiency) {
    this.features.power_efficiency = this.features.power_efficiency.trim(); // Example transformation
  }
  if (this.features.versatility) {
    this.features.versatility = this.features.versatility.trim();
  }
  if (this.features.enhanced_visibility) {
    this.features.enhanced_visibility = this.features.enhanced_visibility.trim();
  }
  if (this.features.comfort_n_ergonomics) {
    this.features.comfort_n_ergonomics = this.features.comfort_n_ergonomics.trim();
  }

  // Update the `updatedAt` field
  this.updatedAt = Date.now();
  next();
});
// Add virtual fields for human-readable keys
equipmentSchema.virtual("readableSpecification").get(function () {
  return {
    "Engine Power": this.specification.engine_power,
    "Engine Type": this.specification.engine_type,
    "Transmission": this.specification.transmission,
    "PTO Power": this.specification.PTO_power,
    "Hydraulic System": this.specification.hydraulic_system,
    "Fuel Tank Capacity": this.specification.fuel_tank_Capacity,
    "Weight": this.specification.weight,
  };
});

equipmentSchema.virtual("readableFeatures").get(function () {
  return {
    "Power Efficiency": this.features.power_efficiency,
    "Versatility": this.features.versatility,
    "Enhanced Visibility": this.features.enhanced_visibility,
    "Comfort & Ergonomics": this.features.comfort_n_ergonomics,
  };
});

const equipment = mongoose.model("equipment", equipmentSchema);


module.exports = equipment


// const EquipmentRentalHistory = mongoose.model("EquipmentRentalHistory", EquipmentRentalHistorySchema);
// const GeographicLocation = mongoose.model("GeographicLocation", GeographicLocationSchema);
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