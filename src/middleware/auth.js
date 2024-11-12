const Farmers = require("../models/users");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Validate Registrstion
const validateRegistration = [
  check("username").notEmpty().withMessage("Name is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Minimum of 8 characters required for password")
    .notEmpty()
    .withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  },
];

function validEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

//VALIDATE FORGOT PASSWORD
const validateForgotPassword = async (req, res, next) => {
  const { email } = req.body;

  const errors = [];

  if (!email) {
    errors.push("Please add your email address");
  } else if (!validEmail(email)) {
    errors.push("Email format is incorrect");
  }
  if (errors.length > 0) {
    return res.status(400).json({
      message: errors,
    });
  }

  next();
};

module.exports = { validateRegistration, validateForgotPassword};
