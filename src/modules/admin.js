const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define the Admin schema
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    contactNumber: { type: String, required: true },
    role: { type: String, default: 'admin'},
    permissions: {
      manageUsers: { type: Boolean, default: false },
      manageEquipment: { type: Boolean, default: false },
      viewReports: { type: Boolean, default: false },
      managePayments: { type: Boolean, default: false },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
const Admin = mongoose.model('Admin', adminSchema);

module.exports =  Admin;