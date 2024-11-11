const express = require("express");
const validateForgotPassword = require("../middleware/auth");
const forgotPassword = require("../controllers/authController");

const router = express.Router();

router.post("/forgot-password", validateToken, validateForgotPassword, forgotPassword);


module.exports = router;