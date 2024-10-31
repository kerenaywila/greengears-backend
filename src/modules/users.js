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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});



const User = mongoose.model('User', userSchema);

module.exports =  User;
// Set up Node.js project with Express and Mongoose.
// Configure MongoDB (Atlas/local).
// Implement User Signup API for User and Admin with OTP email verification using Nodemailer.
// Implement Welcome email on user signup
