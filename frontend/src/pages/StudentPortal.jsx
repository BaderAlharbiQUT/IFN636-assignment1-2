import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const StudentPortal = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axiosInstance.get('/api/students/me/summary', {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });
        setRecords(response.data);
      } catch (error) {
        alert('Failed to fetch student data.');
        console.error(error);
      }
    };

    fetchSummary();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Student Portal</h1>

      {records.length === 0 ? (
        <p className="text-gray-500 text-center">No attendance records available.</p>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <div key={record.studentRecordId} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-semibold mb-2">{record.name}</h2>
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
  );
};

export default StudentPortal;
