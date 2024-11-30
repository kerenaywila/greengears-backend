const express = require('express');
const { createReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/create-report/user', createReport);

module.exports = router;
