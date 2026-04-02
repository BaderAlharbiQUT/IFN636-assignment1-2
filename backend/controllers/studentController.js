const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

const calculateAttendanceRate = (student) => {
  const attended = student.presentCount + student.lateCount;
  if (student.totalSessions === 0) return 0;
  return Number(((attended / student.totalSessions) * 100).toFixed(2));
};

// Teacher: create a student
const createStudent = async (req, res) => {
  try {
    const { name, studentId, email, course } = req.body;

    const student = await Student.create({
      teacherId: req.user.id,
      name,
      studentId,
      email,
      course,
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Teacher: get only their own students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({ teacherId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher: get one of their own students
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher: update only their own student
const updateStudent = async (req, res) => {
  try {
    const { name, studentId, email, course } = req.body;

    const student = await Student.findOne({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.name = name || student.name;
    student.studentId = studentId || student.studentId;
    student.email = email || student.email;
    student.course = course || student.course;

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Teacher: delete only their own student and related attendance history
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await Attendance.deleteMany({ studentId: student._id });
    await Student.deleteOne({ _id: student._id });

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher: record attendance automatically with timestamp
const markAttendance = async (req, res) => {
  try {
    const { status } = req.body;

    const student = await Student.findOne({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const attendance = await Attendance.create({
      studentId: student._id,
      teacherId: req.user.id,
      status,
    });

    student.totalSessions += 1;

    if (status === 'Present') {
      student.presentCount += 1;
    } else if (status === 'Late') {
      student.lateCount += 1;
    } else if (status === 'Absent') {
      student.absentCount += 1;
    }

    student.attendanceRate = calculateAttendanceRate(student);
    await student.save();

    res.status(201).json({
      message: 'Attendance recorded successfully',
      attendance,
      student,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Teacher: get attendance history for one of their students
const getStudentAttendanceHistory = async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      teacherId: req.user.id,
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const history = await Attendance.find({
      studentId: student._id,
      teacherId: req.user.id,
    }).sort({ recordedAt: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student: see only records linked to their email, grouped by teacher
const getMyAttendanceSummary = async (req, res) => {
  try {
    const studentRecords = await Student.find({ email: req.user.email })
      .populate('teacherId', 'name email')
      .sort({ createdAt: -1 });

    const result = studentRecords.map((record) => ({
      studentRecordId: record._id,
      teacher: {
        id: record.teacherId?._id,
        name: record.teacherId?.name,
        email: record.teacherId?.email,
      },
      name: record.name,
      studentId: record.studentId,
      email: record.email,
      course: record.course,
      totalSessions: record.totalSessions,
      presentCount: record.presentCount,
      lateCount: record.lateCount,
      absentCount: record.absentCount,
      attendanceRate: record.attendanceRate,
    }));

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  markAttendance,
  getStudentAttendanceHistory,
  getMyAttendanceSummary,
};
