import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const StudentPortal = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);

  const getStatus = (student) => {
    if (student.present > 0) return 'Present';
    if (student.absent > 0) return 'Absent';
    if (student.late > 0) return 'Late';
    return 'No record';
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/api/students', {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });
        setStudents(response.data);
      } catch (error) {
        alert('Failed to fetch student data.');
        console.error(error);
      }
    };

    fetchStudents();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Portal</h1>

      {students.length === 0 ? (
        <p className="text-gray-500 text-center">No attendance records available.</p>
      ) : (
        <div className="grid gap-4">
          {students.map((student) => (
            <div key={student._id} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold">{student.name}</h2>
              <p><strong>Student ID:</strong> {student.studentId}</p>
              <p><strong>Email:</strong> {student.email}</p>
              <p><strong>Course:</strong> {student.course}</p>
              <p><strong>Status:</strong> {getStatus(student)}</p>
              <p><strong>Attendance Rate:</strong> {student.attendanceRate}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
