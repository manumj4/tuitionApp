const express = require('express');
const { getCollection } = require('../models/collections');
const { ObjectId } = require('mongodb');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(authMiddleware);

// GET - List students with attendance for a given date and optional search/class filters
router.get('/', async (req, res) => {
  try {
    const attendance = getCollection('attendance');
    const students = getCollection('students');

    const { date, class: classFilter, search } = req.query;

    // Build student filter (for search by name and class)
    const studentFilter = {};
    if (classFilter) studentFilter.class = classFilter;
    if (search) studentFilter.fullName = { $regex: new RegExp(search, 'i') };

    const studentList = await students.find(studentFilter).toArray();

    const studentIds = studentList.map(s => s._id.toString());

    // Find attendance records for students on the specified date
    const attendanceData = await attendance.find({
      studentId: { $in: studentIds },
      ...(date ? { date } : {})
    }).toArray();

    // Merge attendance info with student list
    const result = studentList.map(student => {
      const record = attendanceData.find(a => a.studentId === student._id.toString() && (!date || a.date === date));
      return {
        _id: record?._id.toString() || null,
        studentId: student._id.toString(),
        studentName: student.fullName,
        class: student.class,
        date: date || new Date().toISOString().split('T')[0],
        timeMarked: record?.timeMarked || '',
        status: record?.status || 'Select'
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Mark attendance (create new attendance record)
router.post('/', async (req, res) => {
  try {
    const attendance = getCollection('attendance');
    const { studentId, date, status } = req.body;

    // Prevent duplicates: check if attendance record already exists for student and date
    const existing = await attendance.findOne({ studentId, date });
    if (existing) {
      return res.status(400).json({ message: 'Attendance already marked for this student and date' });
    }

    const timeMarked = new Date().toISOString();

    const result = await attendance.insertOne({ studentId, date, status, timeMarked });

    res.status(201).json({ message: 'Attendance marked', id: result.insertedId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT - Update attendance status
router.put('/:id', async (req, res) => {
  const attendance = getCollection('attendance');
  const { status } = req.body;

  const updateFields = { status };

  if (status === 'Select') {
    updateFields.timeMarked = null;
  } else {
    updateFields.timeMarked = new Date().toISOString();
  }

  await attendance.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: updateFields }
  );

  res.send({ message: 'Attendance status updated' });
});

// DELETE - Remove attendance record
router.delete('/:id', async (req, res) => {
  try {
    const attendance = getCollection('attendance');
    await attendance.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - Attendance summary by status
router.get('/summary', async (req, res) => {
  try {
    const attendance = getCollection('attendance');

    const summary = await attendance.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET - List of all unique classes for dropdown filter
router.get('/classes', async (req, res) => {
  try {
    const students = getCollection('students');
    const classes = await students.distinct('class');
    res.json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
