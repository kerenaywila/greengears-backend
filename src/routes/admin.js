const express = require("express");
const { activateUser, deactivateUser } = require('../controllers/authController');
const { verifyToken, checkAdmin } = require('../middleware/auth');

const router = express.Router();

router.put('/activate/:userId', verifyToken, checkAdmin, activateUser);

router.put('/deactivate/:userId', verifyToken, checkAdmin, deactivateUser);

module.exports = router;
