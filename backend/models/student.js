const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  std: {
    type: Number,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  dateOfJoining: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', studentSchema);