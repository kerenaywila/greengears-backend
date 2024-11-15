
//FORGOT PASSWORD

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Farmer.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "The email address you entered could not be found." });
    }

    const resetToken = user.generateResetToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `https://greengears.com/reset-password?token=${resetToken}`;

    await sendMail(
      user.email,
      "Password Reset Request",
      `<div>
        <p>You requested a password reset. Please click the link to reset your password:</p><a href="${resetUrl}">Reset Password</a>
       </div>`
    );

    return res.status(200).json({
      message: "Check your email for a reset link",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//ACTIVATE USER

exports.activateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Farmer.findById(userId);
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

//DEACTIVATE USER

exports.deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await Farmer.findById(userId);
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
