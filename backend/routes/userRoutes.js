const express = require('express');
const { getUsers, addUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { ObjectId } = require('mongodb');
const { getCollection } = require('../models/collections');

const router = express.Router();
router.use(authMiddleware);

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'Admin') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden. Admins only.' });
}
router.get('/', getUsers);
router.post('/', addUser);

router.post('/', async (req, res) => {
  const users = getCollection('users');
  const { fullName, mobile, password, role, permissions } = req.body;
  if (!password) return res.status(400).send({ error: 'Password required' });

  const hashed = await bcrypt.hash(password, 10);  // This hashes correctly
  await users.insertOne({ fullName, mobile, password: hashed, role, permissions });
  res.send({ message: 'User created' });
});

router.put('/:id', async (req, res) => {
  const users = getCollection('users');
  const { password, ...rest } = req.body;

  const updateData = { ...rest };

  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    updateData.password = hashed;
  }

  await users.updateOne(
    { _id: new require('mongodb').ObjectId(req.params.id) },
    { $set: updateData }
  );

  res.send({ message: 'User updated' });
});

router.delete('/:id', async (req, res) => {
  const users = getCollection('users');
  await users.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send({ message: 'User deleted' });
});

module.exports = router;
