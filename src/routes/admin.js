const express = require("express");

const {validateAdmin_Reg,} = require("../middleware/auth");
const { admin_singup, verifyOTP_admin, resendOtp_admin, activateUser_admin, deactivateUser_admin } = require('../controllers/authController');
const { isAdmin, verifyToken } = require("../middleware/adminMiddleware");


const router = express.Router();

router.post('/signup/admin', validateAdmin_Reg, admin_singup);
router.post('/verify-otp/admin', verifyOTP_admin);
router.post('/resend-otp/admin', resendOtp_admin);
router.post('/activate-user/admin/:userId', verifyToken, isAdmin, activateUser_admin);
router.post('/deactivate-user/admin/:userId', verifyToken, isAdmin, deactivateUser_admin);



module.exports = router;
