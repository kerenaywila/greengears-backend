const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/users");
const Admin = require("../models/admin");
const sendMail = require("../utils/mailer");

const crypto = require("crypto");

// User Signup Controller
exports.user_signup = async (req, res) => {
  try {
    const { username, email, password, contactNumber, role, location } =
      req.body;

    // Check if the user already exists
    let user = await Farmer.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user and hash password
    user = new Farmer({
      username,
      email,
      password: await bcryptjs.hash(password, 8),
      contactNumber,
      role,
      location,
    });
    user.generateOTP();

    // Send OTP email

    await sendMail(
      email,
      "Verify your Account",
      `<p>Your OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
    );

    await user.save();
    res.status(200).json({
      message:
        "Signup successful! Please check your email for OTP verification.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OTP Verification Controller for User
exports.verifyOTP_user = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await Farmer.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpires < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    // Send welcome email
    await sendMail(
      email,
      "Welcome to Agricultural Equipment Rental Platform",
      `<p>Hi ${user.username}, welcome to our platform!</p>`
    );

    res.status(200).json({ message: "Account verified successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Resend OTP Controller for User
exports.resendOtp_user = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Farmer.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if OTP is already valid
    if (user.otpExpires > Date.now()) {
      return res.status(400).json({ error: "Current OTP is still valid." });
    }

    // Generate new OTP and update expiration
    user.generateOTP();
    user.otpExpires = new Date(Date.now() + 2 * 60 * 1000); // Extend expiration time
    await user.save();

    // Send the new OTP email
    await sendMail(
      user.email,
      "Resend OTP",
      `<p>Your new OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
    );

    res.json({ message: "OTP resent successfully. Please check your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Signup Controller
exports.admin_singup = async (req, res) => {
  try {
    const { username, email, password, contactNumber, role, permissions } =
      req.body;

    // Check if the user already exists
    let user = await Admin.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Create new user and hash password
    user = new Admin({
      username,
      email,
      password: await bcryptjs.hash(password, 8),
      contactNumber,
      role,
      permissions: permissions || {}, // Ensure permissions object is initialized
    });
    user.generateOTP();

    // Send OTP email
    await sendMail(
      email,
      "Verify your Account",
      `<p>Your OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
    );

    await user.save();
    res.status(200).json({
      message:
        "Signup successful! Please check your email for OTP verification.",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// OTP Verification Controller for Admin
exports.verifyOTP_admin = async (req, res) => {
  try {
    const { email, otp } = req.body;
    let user = await Admin.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check role and set permissions if user is an admin
    if (user.role === "admin") {
      // Ensure permissions object exists
      user.permissions = user.permissions || {};
      user.permissions.manageUsers = true;
      user.permissions.manageEquipment = true;
      user.permissions.viewReports = true;
      user.permissions.managePayments = true;
    }

    // Update user verification status and clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    // Send welcome email
    await sendMail(
      email,
      "Welcome to Agricultural Equipment Rental Platform",
      `<p>Hi ${user.username}, welcome to our platform!</p>`
    );

    res.status(200).json({ message: "Account verified successfully!", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendOtp_admin = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await Admin.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if OTP is already valid
    if (user.otpExpires > Date.now()) {
      return res.status(400).json({ error: "Current OTP is still valid." });
    }

    // Generate new OTP and update expiration
    // Generate new OTP and update expiration
    user.generateOTP();
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // Extend expiration time
    await user.save();

    // Send the new OTP email
    await sendMail(
      user.email,
      "Resend OTP",
      `<p>Your new OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
    );

    res.json({ message: "OTP resent successfully. Please check your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Farmer.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The email address you entered could not be found." });
    }

    const resetToken = user.generateResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://greengears.com/reset-password?token=${resetToken}`;

    await sendMail(
      user.email,
      "Password Reset Request",
      `<div>
        <p>You requested a password reset. Please click the link to reset your password:</p><a href="${resetUrl}">Reset Password</a>
       </div>`
    );

    return res.status(200).json({
      message: "Check your email for a reset link",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//ACTIVATE USER

exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Farmer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Successful", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// DEACTIVATE USER
exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Farmer.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({ message: "User deactivated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// User Login API
exports.user_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    let user = await Farmer.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check if the password is correct
    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password Request
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Farmer.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = user.generateResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with the reset link
    await sendMail(
      user.email,
      "Password Reset Request",
      `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetUrl}">Reset Password</a>`
    );

    return res.status(200).json({ message: "Password reset link sent to email" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await Farmer.findOne({ resetToken: token, tokenExpiry: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Hash new password and save it
    user.password = await bcryptjs.hash(newPassword, 8);
    user.resetToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};