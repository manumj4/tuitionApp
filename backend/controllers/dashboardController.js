const { getCollection } = require('../models/collections');
const { ObjectId } = require('mongodb');

exports.getDashboardSummary = async (req, res) => {
  try {
    const studentsCol = getCollection('students');
    const feesCol = getCollection('fees');
    const salaryCol = getCollection('salary');

    // Total Students (active)
    const totalStudents = await studentsCol.countDocuments({ active: true });

    // Total Fees Collected (sum)
    const totalFeesResult = await feesCol.aggregate([
      { $match: { paid: true } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();
    const totalFeesCollected = totalFeesResult[0]?.total || 0;

    // Total Salary Paid (sum)
    const totalSalaryResult = await salaryCol.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();
    const totalSalaryPaid = totalSalaryResult[0]?.total || 0;

    // Last 5 months statistics for Students Added/Removed, Fees Collected, Salary Given
    // Assuming students have createdAt and removedAt fields (timestamps)
    const now = new Date();
    const lastFiveMonths = [];
    for (let i = 4; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      // Students added in month
      const studentsAdded = await studentsCol.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });
      // Students removed in month (assume 'removedAt' field)
      const studentsRemoved = await studentsCol.countDocuments({
        removedAt: { $gte: start, $lt: end }
      });

      // Fees collected in month (paid true)
      const feesInMonthResult = await feesCol.aggregate([
        {
          $match: {
            paid: true,
            month: start.getMonth() + 1,
            year: start.getFullYear()
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).toArray();
      const feesCollected = feesInMonthResult[0]?.total || 0;

      // Salary paid in month (assuming salary doc has month, year)
      const salaryInMonthResult = await salaryCol.aggregate([
        {
          $match: {
            month: start.getMonth() + 1,
            year: start.getFullYear()
          }
        },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).toArray();
      const salaryGiven = salaryInMonthResult[0]?.total || 0;

      lastFiveMonths.push({
        month: start.toLocaleString('default', { month: 'short', year: 'numeric' }),
        studentsAdded,
        studentsRemoved,
        feesCollected,
        salaryGiven
      });
    }

    res.json({
      totalStudents,
      totalFeesCollected,
      totalSalaryPaid,
      lastFiveMonths
    });
  } catch (error) {
    console.error('Dashboard summary error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
