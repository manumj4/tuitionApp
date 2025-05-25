const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getCollection } = require('../models/collections');

const loginUser = async (req, res) => {
  const { mobile, password } = req.body;
  const users = getCollection('users');
  console.log('Login attempt:', { mobile, password });

  if (!mobile || !password) {
    return res.status(400).json({ message: 'Please provide mobile and password' });
  }

  const user = await users.findOne({ mobile });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  console.log('User found:', user);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log('Password match:', isMatch);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    { id: user._id, role: user.role, permissions: user.permissions },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({
    token,
    user: {
      fullName: user.fullName,
      role: user.role,
      permissions: user.permissions
    }
  });
};

module.exports = { loginUser };
