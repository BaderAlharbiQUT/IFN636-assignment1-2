const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    attendanceRate: {
      type: Number,
      default: 0,
    },
    totalDays: {
      type: Number,
      default: 0,
    },
    present: {
      type: Number,
      default: 0,
    },
    absent: {
      type: Number,
      default: 0,
    },
    late: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
