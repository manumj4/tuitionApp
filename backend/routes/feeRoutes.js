const express = require('express');
const router = express.Router();
const { getCollection } = require('../models/collections');
const { ObjectId } = require('mongodb');
const { authMiddleware } = require('../middleware/authMiddleware');

// GET all fee records, optionally filter by month
router.get('/', authMiddleware, async (req, res) => {
  const { month } = req.query; // e.g. '2025-05'
  const fees = getCollection('fees');

  const query = month ? { month } : {};
  const data = await fees.find(query).sort({ date: -1 }).toArray();

  res.json(data);
});

// POST - Add fee record
router.post('/', authMiddleware, async (req, res) => {
  const { studentId, amount, month, date, status } = req.body;

  if (!studentId || !month) {
    return res.status(400).json({ message: 'Missing required fields: studentId or month' });
  }

  const fees = getCollection('fees');

  await fees.insertOne({
    studentId: new ObjectId(studentId),
    amount: parseFloat(amount) || 0,
    month,
    date: date ? new Date(date) : new Date(),
    status: status || 'Unpaid',
    createdAt: new Date(),
  });

  res.json({ message: 'Fee record added' });
});

// PUT - Update fee record
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { amount, month, date, status } = req.body;

  const fees = getCollection('fees');

  const updateFields = {};
  if (amount !== undefined) updateFields.amount = parseFloat(amount);
  if (month !== undefined) updateFields.month = month;
  if (date !== undefined) updateFields.date = new Date(date);
  if (status !== undefined) updateFields.status = status;

  await fees.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );

  res.json({ message: 'Fee record updated' });
});

// DELETE - Remove fee record
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const fees = getCollection('fees');
  await fees.deleteOne({ _id: new ObjectId(id) });
  res.json({ message: 'Fee record deleted' });
});

// GET - Monthly summary (last 6 months)
router.get('/monthly-summary', authMiddleware, async (req, res) => {
  const fees = getCollection('fees');

  const summary = await fees.aggregate([
    {
      $group: {
        _id: { $substr: ['$date', 0, 7] }, // format: YYYY-MM
        total: { $sum: '$amount' },
      },
    },
    {
      $sort: { _id: -1 },
    },
    {
      $limit: 6,
    },
  ]).toArray();

  res.json(summary.reverse()); // latest month last
});

module.exports = router;
