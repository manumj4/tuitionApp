const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  fees: {
    type: Number,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  dateOfPayment: {
    type: Date,
    default: null
  },
  paid: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Fee', feeSchema);