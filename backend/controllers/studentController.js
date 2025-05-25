const { getCollection } = require('../models/collections');

const getAllStudents = async (req, res) => {
  try {
    const students = getCollection('students');
    const list = await students.find().toArray();
    res.json(list);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents
};
