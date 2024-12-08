const Report = require("../models/report");
const Equipment = require("../models/equipment");

exports.createReport = async (req, res) => {
  try {
    const { farmer_id, equipment_id, description } = req.body;

    // Check if the equipment exists
    const equipment = await Equipment.findOne({ equipment_id });

    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Equipment not found" });
    }

    // Create a new report with the farmer's ID and the equipment ID
    const newReport = new Report({
      equipment_id,
      farmer_id,
      description,
    });

    // Save the new report to the database
    await newReport.save();

    // Return a success response with the report data
    res.status(201).json({
      success: true,
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the report",
      error: error.message,
    });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("equipment_id", "name") // Include equipment name
      .populate("farmer_id", "name") // Include farmer name
      .sort({ createdAt: -1 }); // Sort by newest first

    res
      .status(200)
      .json({
        success: true,
        message: "Reports retrieved successfully",
        reports,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { report_id } = req.params;

    // Find the report by ID
    const report = await Report.findById(report_id);

    // Check if the report exists
    if (!report) {
      return res
        .status(404)
        .json({ success: false, message: "Report not found" });
    }

    if (report.status === "Resolved") {
      return res
        .status(400)
        .json({
          success: false,
          message: "This report has already been resolved",
        });
    }

    // Update the status to 'Resolved'
    report.status = "Resolved";
    await report.save(); // Save the updated report

    res
      .status(200)
      .json({
        success: true,
        message: "The report has been resolved successfully.",
        report,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "An error occurred while updating the report status.",
        error: error.message,
      });
  }
};