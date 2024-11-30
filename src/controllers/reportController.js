exports.createReport = async (req, res) => {
    try {
      const { equipment_id, farmer_id, description } = req.body;
  
      // Validate inputs
      if (!equipment_id || !farmer_id || !description) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }
  
      // Check if the equipment exists
      const equipment = await Equipment.findById(equipment_id);
      if (!equipment) {
        return res.status(404).json({ success: false, message: "Equipment not found" });
      }
  
      // Create the report
      const report = new Report({ equipment_id, farmer_id, description });
      await report.save();
  
      res.status(201).json({ success: true, message: "Report submitted successfully", report });
    } catch (error) {
      res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  };

  exports.getAllReports = async (req, res) => {
    try {
      const reports = await Report.find()
        .populate('equipment_id', 'name') // Include equipment name
        .populate('farmer_id', 'name') // Include farmer name
        .sort({ createdAt: -1 }); // Sort by newest first
  
      res.status(200).json({ success: true, message: "Reports retrieved successfully", reports });
    } catch (error) {
      res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  };

  exports.updateReportStatus = async (req, res) => {
    try {
      const { report_id } = req.params;
      const { status } = req.body;
  
      // Validate status
      if (!['Pending', 'Resolved'].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status value" });
      }
  
      // Update the report
      const report = await Report.findByIdAndUpdate(
        report_id,
        { status },
        { new: true } // Return the updated document
      );
  
      if (!report) {
        return res.status(404).json({ success: false, message: "Report not found" });
      }
  
      res.status(200).json({ success: true, message: "Report status updated successfully", report });
    } catch (error) {
      res.status(500).json({ success: false, message: "An error occurred", error: error.message });
    }
  };
  
  