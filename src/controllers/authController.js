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

// Resend OTP Controller for User
exports.resendOtp_user = async (req, res) => {
    try {
        const { email } = req.body;
        let user = await Farmer.findOne({ email });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if OTP is already valid
        if (user.otpExpires > Date.now()) {
            return res.status(400).json({ error: 'Current OTP is still valid.' });
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

        res.json({ message: 'OTP resent successfully. Please check your email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Admin Signup Controller
exports.admin_singup = async (req, res) => {
    try {
        const { name, email, password, contactNumber, role, permissions } = req.body;

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
            permissions: permissions || {}  // Ensure permissions object is initialized
        });
        user.generateOTP();

        // Send OTP email
        await sendMail(
            email,
            "Verify your Account",
            `<p>Your OTP code is <strong>${user.otp}</strong>. It expires in 10 minutes.</p>`
        );

        await user.save();
        res.status(200).json({ message: "Signup successful! Please check your email for OTP verification." });
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
            `<p>Hi ${user.name}, welcome to our platform!</p>`
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

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Check if OTP is already valid
        if (user.otpExpires > Date.now()) {
            return res.status(400).json({ error: 'Current OTP is still valid.' });
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

        res.json({ message: 'OTP resent successfully. Please check your email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

