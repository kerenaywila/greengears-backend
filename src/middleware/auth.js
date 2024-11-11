const mongoose = require("mongoose");
const Users = require("../models/users");

function validEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

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

const checkAdmin = async (req, res, next) => {
  const user = await Users.findById(req.user.id);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};

module.exports = { validateForgotPassword, checkAdmin };
