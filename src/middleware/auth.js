const Farmers = require("../models/users");
const { check, validationResult } = require("express-validator");

// Validate Registration
const validateRegistration = [
  check("name")
    .notEmpty()
    .withMessage("Name is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((password) => {
      const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!validatePassword.test(password)) {
        throw new Error(
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
      return true; // Valid password
    })
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


// Validate Admin Registration
const validateAdmin_Reg = [
  check("username")
    .notEmpty()
    .withMessage("Username is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((password) => {
      const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!validatePassword.test(password)) {
        throw new Error(
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
      return true; // Valid password
    })
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

// Validate Admin Registration
const validateAdmin_Reg = [
  check("username")
    .notEmpty()
    .withMessage("Username is required"),

  check("email")
    .isEmail()
    .withMessage("Invalid email format")
    .notEmpty()
    .withMessage("Email is required"),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .custom((password) => {
      const validatePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!validatePassword.test(password)) {
        throw new Error(
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
      return true; // Valid password
    })
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

const validateBooking = [
  check("customer_id").notEmpty().withMessage("Customer ID is required"),
  check("rental_date").isISO8601().withMessage("Rental date must be a valid date"),
  check("return_date").isISO8601().withMessage("Return date must be a valid date"),
  check("rental_duration")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Rental duration must be a positive integer"),
  check("rental_cost")
    .optional()
    .isDecimal()
    .withMessage("Rental cost must be a valid number"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


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


const validatePasswordRest = [
  // Password must not be empty
  check("newPassword")
      .notEmpty()
      .withMessage("Password is required")

      // Password length validation
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")

      // Password complexity validation
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .withMessage("Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),

  // Error handling middleware
  (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
          return res.status(400).json({
              success: false,
              errors: errors.array().map(error => ({
                  field: error.param,
                  message: error.msg,
              })),
          });
      }

      next();
  },
];

module.exports = { validateRegistration, validateAdmin_Reg, validateBooking, validateForgotPassword, validatePasswordRest};
