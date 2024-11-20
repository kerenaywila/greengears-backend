const express = require("express");
const { user_signup, verifyOTP_user, resendOtp_user, forgotPassword, user_login, resetPassword } = require('../controllers/authController');
const { validateRegistration, validateForgotPassword } = require("../middleware/auth");
const { verifyToken } = require('../middleware/adminMiddleware');
const { checkRole } = require("../middleware/rbacMiddleware");

const router = express.Router();

router.post('/signup/user', validateRegistration, user_signup);
router.post('/verify-otp/user', verifyOTP_user);
router.post('/resend-otp/user', resendOtp_user);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", resetPassword);

// Login Route
router.post('/login/user', user_login);

// Protected Routes with Role-Based Access Control (RBAC)
router.get('/admin/dashboard', verifyToken, checkRole(['admin']), (req, res) => {
  res.status(200).json({ message: "Welcome to the Admin Dashboard!" });
});

module.exports = router;
