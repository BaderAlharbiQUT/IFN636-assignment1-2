import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudentList = ({ students, setStudents, setEditingStudent, refreshStudents }) => {
  const { user } = useAuth();
  const [activeAttendanceStudent, setActiveAttendanceStudent] = useState(null);

  const handleDelete = async (studentId) => {
    try {
      await axiosInstance.delete(`/api/students/${studentId}`, {
        headers: user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {},
      });

      setStudents(students.filter((student) => student._id !== studentId));
    } catch (error) {
      alert('Failed to delete student.');
    }
  };

  const handleAttendance = async (studentId, status) => {
    try {
      await axiosInstance.post(
        `/api/students/${studentId}/attendance`,
        { status },
        {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        }
      );

      setActiveAttendanceStudent(null);
      refreshStudents();
    } catch (error) {
      alert('Failed to record attendance.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Student Records</h2>

      {students.length === 0 ? (
        <p className="text-gray-500">No students found.</p>
      ) : (
        students.map((student) => (
          <div key={student._id} className="bg-gray-100 p-4 mb-4 rounded shadow">
            <h3 className="font-bold text-lg">{student.name}</h3>
            <p><strong>Student ID:</strong> {student.studentId}</p>
            <p><strong>Email:</strong> {student.email}</p>
            <p><strong>Course:</strong> {student.course}</p>
            <p><strong>Total Sessions:</strong> {student.totalSessions}</p>
            <p><strong>Present:</strong> {student.presentCount}</p>
            <p><strong>Late:</strong> {student.lateCount}</p>
            <p><strong>Absent:</strong> {student.absentCount}</p>
            <p><strong>Attendance Rate:</strong> {student.attendanceRate}%</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setEditingStudent(student)}
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => setActiveAttendanceStudent(student._id)}
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

            {activeAttendanceStudent === student._id && (
              <div className="mt-4 flex flex-wrap gap-2">
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
                  className="bg-gray-700 text-white px-4 py-2 rounded"
                >
                  Absent
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default StudentList;
