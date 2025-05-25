const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/collections');
const { authMiddleware } = require('../middleware/authMiddleware');
const { ObjectId } = require('mongodb');

// GET all students
router.get('/', authMiddleware, async (req, res) => {
  const students = getCollection('students');
  const data = await students.find({}).sort({ fullName: 1 }).toArray();
  res.json(data);
});

// POST - Add student
router.post('/', authMiddleware, async (req, res) => {
  const { fullName, class: stdClass, mobile, status, admissionDate, fees } = req.body;
  if (!fullName || !stdClass || !mobile) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  const students = getCollection('students');
  await students.insertOne({
    fullName,
    class: stdClass,
    mobile,
    status: status || 'Active',
    admissionDate: Date.now(),
    fees: fees || 0,
    createdAt: Date.now(),
  });

  res.json({ message: 'Student added' });
});

// PUT - Update student
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { fullName, class: stdClass, mobile, status, admissionDate, fees } = req.body;

  const students = getCollection('students');
  await students.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        fullName,
        class: stdClass,
        mobile,
        status,
        admissionDate,
        fees
      }
    }
  );

  res.json({ message: 'Student updated' });
});

// DELETE - Archive/Delete student
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const students = getCollection('students');
  await students.deleteOne({ _id: new ObjectId(id) });

  res.json({ message: 'Student deleted' });
});

module.exports = router;
