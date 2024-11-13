const crypto = require('crypto');

const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  role: { type: String, enum: ['renter', 'owner'], required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  equipmentPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
    },
  ],
otp: String,
otpExpires: Date,
isVerified: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now }
});

userSchema.methods.generateOTP = function() {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
};

const Farmer = mongoose.model('Farmer', userSchema);

module.exports =  Farmer;
// Set up Node.js project with Express and Mongoose.
// Configure MongoDB (Atlas/local).
// Implement User Signup API for User and Admin with OTP email verification using Nodemailer.
// Implement Welcome email on user signup
