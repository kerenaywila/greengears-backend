const mongoose = require("mongoose");
const Farmer = require('../models/users');

const ReportSchema = new mongoose.Schema(
  {
    customer_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
