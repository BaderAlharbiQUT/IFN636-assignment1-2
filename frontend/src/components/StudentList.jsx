import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudentList = ({ students, setStudents, setEditingStudent }) => {
  const { user } = useAuth();

  const getStatus = (student) => {
    if (student.present > 0) return 'Present';
    if (student.absent > 0) return 'Absent';
    if (student.late > 0) return 'Late';
    return 'No record';
  };

  // Delete one student record
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
            <p><strong>Status:</strong> {getStatus(student)}</p>
            <p><strong>Attendance Rate:</strong> {student.attendanceRate}%</p>

            <div className="mt-3">
              <button
                onClick={() => setEditingStudent(student)}
                className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(student._id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default StudentList;
