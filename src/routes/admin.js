const express = require("express");

const { admin_singup, verifyOTP_admin, resendOtp_admin } = require('../controllers/authController');
const { validateRegistration } = require("../middleware/auth");

const router = express.Router();

router.post('/signup/admin', validateRegistration, admin_singup);
router.post('/verify-otp/admin', verifyOTP_admin);
router.post('/resend-otp/admin', resendOtp_admin);

module.exports = router;
