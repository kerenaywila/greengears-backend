const express = require("express");

const {validateRegistration,} = require("../middleware/auth");
const { admin_singup, verifyOTP_admin, resendOtp_admin, activateUser_admin, deactivateUser_admin } = require('../controllers/authController');
const { isAdmin } = require("../middleware/adminMiddleware");


const router = express.Router();

// Login Route
router.post('/login/user', Admin_login);

router.post('/signup/admin', validateAdmin_Reg, admin_singup);
router.post('/verify-otp/admin', verifyOTP_admin);
router.post('/resend-otp/admin', resendOtp_admin);
router.post('/activate-user/admin', isAdmin, activateUser_admin);
router.post('/deactivate-user/admin', isAdmin, deactivateUser_admin);



module.exports = router;
