const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.EMAIL}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

const sendResetEmail = async (email, resetUrl) => {
  try {
    const detailsToSend = {
      from: process.env.Email,
      to: email,
      subject: "Password Reset Request",
      html: `<div>
            <p>You requested a password reset. Please click the link to reset your password:</p><a href="${resetUrl}">Reset Password</a>
            </div>`,
    };
    const result = await mailTransporter.sendMail(detailsToSend);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendResetEmail;
