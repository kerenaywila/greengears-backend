const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Users = require("../models/users");
const crypto = require("crypto");
const sendResetEmail = require("../../utils/emailService");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Users.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The email address you entered could not be found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const tokenExpiration = Date.now() + 3600000;

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = tokenExpiration;
    await user.save();

    //const resetUrl = `https://greengears.com/reset-password?token=${resetToken}`;

    await sendResetEmail(user.email, resetUrl);

    return res.status(200).json({
      message: "Succesfull",
      user: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = true;
    await user.save();

    return res.status(200).json({ message: "Successful", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({ message: "Successful", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { forgotPassword, activateUser, deactivateUser };
