const express = require('express');
const router = express.Router();
const Attendance = require('../models/attendance');

// Get attendance by date
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const attendance = await Attendance.find({ date });
    res.json({ data: attendance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add or update attendance
router.post('/', async (req, res) => {
  try {
    const attendanceData = req.body; // Assuming an array of attendance records

    // Iterate through the attendance data and update/create records
    for (const data of attendanceData) {
      const { studentId, date, status } = data;
      
      // Find an existing record for this student and date
      let existingAttendance = await Attendance.findOne({ studentId, date });

      if (existingAttendance) {
        // Update existing record
        existingAttendance.status = status;
        await existingAttendance.save();
      } else {
        // Create a new record
        const newAttendance = new Attendance({
          studentId,
          studentName:data.studentName,
          date,
          status,
        });
        await newAttendance.save();
      }
    }

    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;