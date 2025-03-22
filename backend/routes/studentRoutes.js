const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json({data:students});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a student
router.post('/', async (req, res) => {
  const student = new Student({
    name: req.body.name,
    std: req.body.std,
    subject: req.body.subject,
    mobile: req.body.mobile,
    fees: req.body.fees,
    dateOfJoining:req.body.dateOfJoining || new Date()
  });

  try {
    const newStudent = await student.save();
    res.status(201).json({status:"success"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;