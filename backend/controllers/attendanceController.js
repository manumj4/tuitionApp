const { getCollection } = require('../models/collections');

const getAttendance = async (req, res) => {
  const attendance = getCollection('attendance');
  const data = await attendance.find().toArray();
  res.json(data);
};

const markAttendance = async (req, res) => {
  const attendance = getCollection('attendance');
  const result = await attendance.insertOne(req.body);
  res.json({ message: 'Attendance marked', id: result.insertedId });
};

module.exports = { getAttendance, markAttendance };
