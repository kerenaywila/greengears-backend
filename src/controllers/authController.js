const bcryptjs = require("bcryptjs");
const Farmer = require('../models/users');
const Admin = require('../models/admin')
const sendMail = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');


// User Signup Controller
exports.user_signup = async (req, res) => {
    try {
        const { 
            customer_id,
            name,
            email, 
            password, 
            contactNumber, 
            role, 
            age, 
            gender, 
            farm_size, 
            crop_types, 
            location, 
            equipmentPosted 
        } = req.body;

        // Check if the user already exists
        let user = await Farmer.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        

        // Validate and map `farm_size`
        const sizeMapping = {
            small: 10,
            medium: 50,
            large: 100,
        };

        const mappedFarmSize = sizeMapping[farm_size?.toLowerCase()] || null;
        if (!mappedFarmSize) {
            return res.status(400).json({ message: "Invalid farm_size provided. Valid options are 'small', 'medium', or 'large'." });
        }

      
        customer_id: customer_id || uuidv4();
        if (!customer_id && !uuidv4()) {
            return res.status(400).json({ message: "Customer ID is required." });
        }
        const finalCustomerId = customer_id || uuidv4();
        // Create new user and hash password
        user = new Farmer({
            customer_id : finalCustomerId,
            name,
            email,
            password: await bcryptjs.hash(password, 8),
            contactNumber,
            role,
            age,
            gender,
            farm_size: mappedFarmSize,
            crop_types,
            location,
            equipmentPosted,
        });

        // Generate OTP for verification
        user.generateOTP();

        // Send OTP email
        await sendMail(
            email,
            "Verify your Account",
            `<p>Your OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
        );

        // Save user to database
        await user.save();
        res.status(200).json({ message: "Signup successful! Please check your email for OTP verification." });
    } catch (error) {
        console.error("Signup Error:", error.message);
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
            `<p>Hi ${user.name}, welcome to our platform!</p>`
        );

        res.status(200).json({ message: "Account verified successfully!", user});
    } catch (error) {
        res.status(500).json({ error: error.message });
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
