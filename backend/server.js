const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const { connectToDB } = require('./models/db');

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const feeRoutes = require('./routes/feeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
app.use(cors());
app.use(express.json());
console.log("before start connect db");
connectToDB(() => {
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/fees', feeRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/users', userRoutes);

  app.use('/api/dashboard', dashboardRoutes);
  app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend', '404.html'));
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

