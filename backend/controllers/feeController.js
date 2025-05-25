const { getCollection } = require('../models/collections');

const getFees = async (req, res) => {
  const fees = getCollection('fees');
  const data = await fees.find().toArray();
  res.json(data);
};

const addFee = async (req, res) => {
  const fees = getCollection('fees');
  const result = await fees.insertOne(req.body);
  res.json({ message: 'Fee recorded', id: result.insertedId });
};

module.exports = { getFees, addFee };
