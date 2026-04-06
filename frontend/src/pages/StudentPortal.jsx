import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const StudentPortal = () => {
  const [records, setRecords] = useState([]);

  const fetchStudentSummary = async () => {
    try {
      const response = await axiosInstance.get('/api/students/me/summary');
      setRecords(response.data);
    } catch (error) {
      alert('Failed to fetch student data.');
    }
  };

  useEffect(() => {
    fetchStudentSummary();
  }, []);

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/student-bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-8 text-center">Student Portal</h1>

        {records.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No attendance records available.</p>
        ) : (
          <div className="grid gap-4">
            {records.map((record) => (
              <div key={record.studentRecordId} className="bg-gray-100 shadow rounded p-5">
                <h2 className="text-2xl font-semibold mb-3">{record.name}</h2>
                <p><strong>Teacher:</strong> {record.teacher?.name}</p>
                <p><strong>Teacher Email:</strong> {record.teacher?.email}</p>
                <p><strong>Student ID:</strong> {record.studentId}</p>
                <p><strong>Email:</strong> {record.email}</p>
                <p><strong>Course:</strong> {record.course}</p>
                <p><strong>Total Sessions:</strong> {record.totalSessions}</p>
                <p><strong>Present:</strong> {record.presentCount}</p>
                <p><strong>Late:</strong> {record.lateCount}</p>
                <p><strong>Absent:</strong> {record.absentCount}</p>
                <p><strong>Attendance Rate:</strong> {record.attendanceRate}%</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
