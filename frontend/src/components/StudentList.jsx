import { useState } from 'react';
import axiosInstance from '../axiosConfig';

const StudentList = ({ students, setStudents, setEditingStudent }) => {
  const [showAttendanceFor, setShowAttendanceFor] = useState(null);

  const handleDelete = async (studentId) => {
    try {
      await axiosInstance.delete(`/api/students/${studentId}`);

      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== studentId)
      );
    } catch (error) {
      console.error('Delete error:', error.response?.data || error.message);
      alert('Failed to delete student.');
    }
  };

  const handleAttendance = async (studentId, status) => {
    try {
      const response = await axiosInstance.post(
        `/api/students/${studentId}/attendance`,
        { status }
      );

      const updatedStudent = response?.data?.student;

      if (updatedStudent && updatedStudent._id) {
        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === updatedStudent._id ? updatedStudent : student
          )
        );
      } else {
        // Fallback: update counts locally if backend did not return updated student
        setStudents((prevStudents) =>
          prevStudents.map((student) => {
            if (student._id !== studentId) return student;

            const newTotalSessions = (student.totalSessions || 0) + 1;
            const newPresentCount =
              (student.presentCount || 0) + (status === 'Present' ? 1 : 0);
            const newLateCount =
              (student.lateCount || 0) + (status === 'Late' ? 1 : 0);
            const newAbsentCount =
              (student.absentCount || 0) + (status === 'Absent' ? 1 : 0);

            const newAttendanceRate =
              newTotalSessions > 0
                ? Number(
                    (
                      ((newPresentCount + newLateCount) / newTotalSessions) *
                      100
                    ).toFixed(2)
                  )
                : 0;

            return {
              ...student,
              totalSessions: newTotalSessions,
              presentCount: newPresentCount,
              lateCount: newLateCount,
              absentCount: newAbsentCount,
              attendanceRate: newAttendanceRate,
            };
          })
        );
      }

      setShowAttendanceFor(null);
    } catch (error) {
      console.error('Attendance error:', error.response?.data || error.message);
      alert('Failed to record attendance.');
    }
  };

  if (!students || students.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-3xl font-bold mb-4">Student Records</h2>
        <p className="text-gray-600">No students found.</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-bold mb-6">Student Records</h2>

      <div className="space-y-6">
        {students.map((student) => (
          <div key={student._id} className="bg-gray-100 rounded shadow p-6">
            <h3 className="text-2xl font-bold mb-3">{student.name}</h3>

            <p><strong>Student ID:</strong> {student.studentId}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Total Sessions:</strong> {student.totalSessions || 0}</p>
            <p><strong>Present:</strong> {student.presentCount || 0}</p>
            <p><strong>Late:</strong> {student.lateCount || 0}</p>
            <p><strong>Absent:</strong> {student.absentCount || 0}</p>
            <p>
              <strong>Attendance Rate:</strong> {student.attendanceRate || 0}%
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => setEditingStudent(student)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  setShowAttendanceFor(
                    showAttendanceFor === student._id ? null : student._id
                  )
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Make Attendance
              </button>

              <button
                onClick={() => handleDelete(student._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>

            {showAttendanceFor === student._id && (
              <div className="flex flex-wrap gap-3 mt-4">
                <button
                  onClick={() => handleAttendance(student._id, 'Present')}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Present
                </button>

                <button
                  onClick={() => handleAttendance(student._id, 'Late')}
                  className="bg-orange-500 text-white px-4 py-2 rounded"
                >
                  Late
                </button>

                <button
                  onClick={() => handleAttendance(student._id, 'Absent')}
                  className="bg-gray-800 text-white px-4 py-2 rounded"
                >
                  Absent
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentList;
