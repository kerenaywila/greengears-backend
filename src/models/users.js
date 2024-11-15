const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  contactNumber: { type: String, required: true },
  role: { type: String, enum: ["renter", "owner"], required: true },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
  },
  equipmentPosted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
  ],
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  resetToken: {type: String},
  tokenExpiry: {type: Date},
  isActive: {type: Boolean, default: true},
});

userSchema.methods.generateOTP = function () {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = resetToken;
  this.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1-hour expiry for reset token
  return resetToken;
};

const Farmer = mongoose.model("Farmer", userSchema);

module.exports = Farmer;
