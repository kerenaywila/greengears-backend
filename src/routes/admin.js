const express = require("express");
const {
  admin_singup,
  verifyOTP_admin,
  resendOtp_admin,
  activateUser,
  deactivateUser,
} = require("../controllers/authController");
const {validateRegistration,} = require("../middleware/auth");
const { isAdmin, verifyToken } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/signup/admin", validateRegistration, admin_singup);
router.post("/verify-otp/admin", verifyOTP_admin);
router.post("/resend-otp/admin", resendOtp_admin);
router.post("/activate/:userId", verifyToken, isAdmin, activateUser);
router.post("/deactivate/:userId", verifyToken, isAdmin, deactivateUser);

module.exports = router;
