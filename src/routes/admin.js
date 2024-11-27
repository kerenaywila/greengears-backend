const express = require("express");

const {validateAdmin_Reg} = require("../middleware/auth");
// const { isAdmin, verifyToken } = require("../middleware/adminMiddleware");

const { admin_singup, Admin_login, verifyOTP_admin, resendOtp_admin } = require('../controllers/authController');

const router = express.Router();

// Login Route
router.post('/login/user', Admin_login);

router.post('/signup/admin', validateAdmin_Reg, admin_singup);
router.post('/verify-otp/admin', verifyOTP_admin);
router.post('/resend-otp/admin', resendOtp_admin);
router.post('/activate-user/admin', activateUser_admin);
router.post('/deactivate-user/admin', deactivateUser_admin);



module.exports = router;
