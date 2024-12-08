const mongoose = require('mongoose');
const Schema = mongoose.Schema
const crypto = require('crypto');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true,lowercase: true },
  password: { type: String,required: true },
  contactNumber: { type: String, required: true  },
  role: { type: String, default: 'admin'},
  permissions: {
    manageUsers: { type: Boolean, default: false },
    manageEquipment: { type: Boolean, default: false },
    viewReports: { type: Boolean, default: false },
    managePayments: { type: Boolean, default: false },
  },
otp: String,
otpExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.methods.generateOTP = function() {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
