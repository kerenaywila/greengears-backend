const express = require('express');
const { createReport, getAllReports, updateReportStatus } = require('../controllers/reportController');
const { isAdmin, verifyToken } = require("../middleware/adminMiddleware");

const router = express.Router();

router.post('/create-report/user', createReport);
router.get('/get-reports/admin', isAdmin, getAllReports);
router.put('/update-reports/:report_id/admin', isAdmin, updateReportStatus);

module.exports = router;
