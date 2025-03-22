const express = require('express');
const router = express.Router();
const Fee = require('../models/fee');

// Get fees data by month
router.get('/', async (req, res) => {
  try {
    const month = req.query.month;
    const fees = await Fee.find({ month });
    res.json({ data: fees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update fees as paid
router.post('/', async (req, res) => {
  try {
    const { studentId, month, paid } = req.body;
    await Fee.findOneAndUpdate({ studentId, month }, { paid }, { new: true });
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;