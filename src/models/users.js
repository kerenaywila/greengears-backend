const crypto = require('crypto');

const mongoose = require("mongoose")
const Schema = mongoose.Schema




// Define the User schema
const userSchema = new mongoose.Schema({
  customer_id: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  farm_size: { type: Number, required: true, default: 0 },
  crop_types: ["String"],
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
      type: String, required: true
    },
  ],
otp: String,
otpExpires: Date,
isVerified: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now },
updatedAt: {
  type: Date,
  default: Date.now,
},
});

userSchema.methods.generateOTP = function() {
  this.otp = crypto.randomInt(100000, 999999).toString();
  this.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
};

const Farmer = mongoose.model('Farmer', userSchema);

module.exports =  Farmer;
