const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const {authMiddleware} = require('../middleware/authMiddleware');

// Protect this route, only logged in users
router.get('/summary', authMiddleware, dashboardController.getDashboardSummary);

module.exports = router;
