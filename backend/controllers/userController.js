const { getCollection } = require('../models/collections');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
  const users = getCollection('users');
  const data = await users.find({}, { projection: { password: 0 } }).toArray();
  res.json(data);
};

const addUser = async (req, res) => {
  const users = getCollection('users');
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { ...req.body, password: hashedPassword };
  const result = await users.insertOne(user);
  res.json({ message: 'User added', id: result.insertedId });
};

module.exports = { getUsers, addUser };
