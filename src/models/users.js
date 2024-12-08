const crypto = require('crypto');

const mongoose = require("mongoose")
const Schema = mongoose.Schema



// Define the User schema
const userSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  name: { type: String, required: true },
 
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
otp: String,
otpExpires: Date,
isVerified: { type: Boolean, default: false },
isActive: String,
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default: Date.now },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

userSchema.methods.generateOTP = function() {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
};

userSchema.methods.generateResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash and set the reset token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration time (e.g., 1 hour)
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
  
  return resetToken;
};

const Farmer = mongoose.model('Farmer', userSchema);

module.exports =  Farmer;


 // age: { type: Number, required: true },
  // gender: { type: String, required: true },
  // farm_size: { type: Number, required: true, default: 0 },
  // crop_types: ["String"],
    // contactNumber: { type: String, required: true },
  // role: { type: String, enum: ['renter', 'owner'], required: true },
  // location: {
  //   city: { type: String, required: true },
  //   state: { type: String, required: true },
  //   country: { type: String, required: true },
  // },
  // equipmentPosted: [
  //   {
  //     type: String, required: true
  //   },
  // ],