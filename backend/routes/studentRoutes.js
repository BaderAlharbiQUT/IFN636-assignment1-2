const express = require('express');
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  markAttendance,
  getStudentAttendanceHistory,
  getMyAttendanceSummary,
} = require('../controllers/studentController');

// Useing  existing auth middleware file here
const { protect } = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// Student routes
router.get('/me/summary', protect, authorizeRoles('student'), getMyAttendanceSummary);

// Teacher routes
router.post('/', protect, authorizeRoles('teacher'), createStudent);
router.get('/', protect, authorizeRoles('teacher'), getStudents);
router.get('/:id', protect, authorizeRoles('teacher'), getStudentById);
router.put('/:id', protect, authorizeRoles('teacher'), updateStudent);
router.delete('/:id', protect, authorizeRoles('teacher'), deleteStudent);

// Teacher attendance routes
router.post('/:id/attendance', protect, authorizeRoles('teacher'), markAttendance);
router.get('/:id/attendance', protect, authorizeRoles('teacher'), getStudentAttendanceHistory);

module.exports = router;
