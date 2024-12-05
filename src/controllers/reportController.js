const Report = require("../models/report");
const Equipment = require("../models/equipment");
const Farmer = require("../models/users");
const sendMail = require("../utils/mailer");

exports.createReport = async (req, res) => {
  try {
    const { customer_id, name, email, message } = req.body;

    if (!customer_id || !name || !email || !message) {
      return res.status(400).json({ error: "Enter all required fields" });
    }

    // Check if the user exists
    const user = await Farmer.findOne({ customer_id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Create a new report
    const newReport = new Report({
      customer_id,
      name,
      email,
      message,
    });

    await newReport.save();

    // Send email notification to admin
    const adminSubject = `New Report Submitted by ${name}`;
    const adminHtml = `
        <p>Dear Admin,</p>
        <p>A new report has been submitted by a customer. Here's a summary:</p></br>
        <blockquote>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p></br>
          <p><strong>Message:</strong> ${message}</p>
        </blockquote></br>
        <p>If additional information is needed, you may want to reach out to the customer directly</p>
        <p>Thank you for your prompt attention to this matter</p></br>
        <p>Best regards,</p>
        <p>Agricultural Equipment Rental</p>
    `;

    await sendMail(process.env.EMAIL_USER, adminSubject, adminHtml); // Send to admin (admin's email)

    // Send email confirmation for the user
    const userSubject = `Report Submitted by ${name}`;
    const userHtml = `
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to us. We've received your report regarding the issue. Here's a summary of your submission:</p>
        <blockquote>
            <p><strong>Message:</strong> ${message}</p>
        </blockquote>
        <p>We will look into your issue and get back to you as soon as possible. In the meantime, you can always contact our support if you have further questions.</p>
        <p>Best regards</p>
        <p>Your Rental Service Team</p>
    `;

    // Send email to user
    await sendMail(user.email, userSubject, userHtml); // Send to user

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
    const reports = await Report.find();

    res.status(200).json({
      success: true,
      message: "Reports retrieved successfully",
      reports,
    });
  } catch (error) {
    res.status(500).json({
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
      return res.status(400).json({
        success: false,
        message: "This report has already been resolved",
      });
    }

    // Update the status to 'Resolved'
    report.status = "Resolved";
    await report.save();

    // Send email confirmation for the user
    const user = await Farmer.findOne({ customer_id: report.customer_id });
    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Failed to send email: User not found",
        });
    }

    const userSubject = `Report Resolved`;
    const userHtml = `
    <p>Dear ${user.name},</p>
    <p>We're pleased to inform you that your report regarding the issue has been resolved.</p>
    <p>If you have any further questions or experience any other issues, please feel free to reach out to our support team.</p>
    <p>Thank you for using our service!</p><br/>
    <p>Best regards,</p>
    <p>Your Rental Service Team</p>
    `;

    await sendMail(user.email, userSubject, userHtml);

    res.status(200).json({
      success: true,
      message: "The report has been resolved successfully.",
      report,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the report status.",
      error: error.message,
    });
  }
};
