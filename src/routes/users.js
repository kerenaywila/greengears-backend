const express = require('express');

const { user_signup, verifyOTP_user, resendOtp_user } = require('../controllers/authController');
const { validateRegistration } = require("../middleware/auth");

const router = express.Router();

router.post('/signup/user',validateRegistration, user_signup);
router.post('/verify-otp/user', verifyOTP_user);
router.post('/resend-otp/user', resendOtp_user);

module.exports = router;
