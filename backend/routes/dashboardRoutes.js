const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Fee = require('../models/fee');

router.get('/', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalFees = await Student.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: '$fees' }
        }
      }
    ]).then(result => result.length > 0 ? result[0].total : 0);

    const currentDate = new Date();
    const last5Months = [];
    for (let i = 4; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      last5Months.push(month);
    }
    const studentsAddedLast5Months = await Student.aggregate([
      {
        $match: {
          dateOfJoining: { $gte: last5Months[4].toISOString(), $lte: currentDate.toISOString() }
        }
      },
      {
        $group: {
          _id: { $month: { $toDate: "$dateOfJoining" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]).then(result => {
      const monthNames = ["jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"];
      return last5Months.map((month, index) => {
        const matchingMonth = result.find(item => item._id === month.getMonth() + 1);
        return { month: monthNames[month.getMonth()], count: matchingMonth ? matchingMonth.count : 0 };
      });
    });

    const studentRemovedLast5Months = []; // Placeholder - need to modify your model to track removal date

    const feesCollected = await Fee.aggregate([
      {
        $match: { paid: true }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$fees' }
        }
      }
    ]).then(result => result.length > 0 ? result[0].total : 0);

    const salaryGiven = 0; // Placeholder - need a model for salary data

    res.json({
      totalStudents,
      totalFees,
      studentsAddedLast5Months,
      studentRemovedLast5Months,
      feesCollected,
      salaryGiven
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;