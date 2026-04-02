const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    // The teacher who owns this student record
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      required: true,
    },

    // Must match the student's login email later
    email: {
      type: String,
      required: true,
    },

    course: {
      type: String,
      required: true,
    },

    // Summary counters for quick dashboard display
    totalSessions: {
      type: Number,
      default: 0,
    },
    presentCount: {
      type: Number,
      default: 0,
    },
    lateCount: {
      type: Number,
      default: 0,
    },
    absentCount: {
      type: Number,
      default: 0,
    },
    attendanceRate: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent one teacher from creating duplicate student IDs
studentSchema.index({ teacherId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Student', studentSchema);
