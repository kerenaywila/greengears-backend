const mongoose = require("mongoose");
const Farmer = require('../models/users');

const ReportSchema = new mongoose.Schema(
  {
    equipment_id: { type: String, required: true },
    farmer_id: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true},
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);