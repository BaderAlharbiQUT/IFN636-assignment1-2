import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/api/students');
      setStudents(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load teacher dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (editingStudent) {
      setShowForm(true);
    }
  }, [editingStudent]);

  const totalStudents = students.length;
  const presentCount = students.reduce((sum, student) => sum + (student.presentCount || 0), 0);
  const lateCount = students.reduce((sum, student) => sum + (student.lateCount || 0), 0);
  const absentCount = students.reduce((sum, student) => sum + (student.absentCount || 0), 0);

  if (loading) {
    return <div className="p-6 text-center text-xl">Loading teacher dashboard...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600 text-xl">{error}</div>;
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/teacher-bg.jpg')" }}
    >
      <div className="bg-white bg-opacity-90 rounded-lg p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h1 className="text-4xl font-bold text-center md:text-left">Teacher Dashboard</h1>

          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingStudent(null);
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {showForm ? 'Close Form' : 'Add Student'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white shadow rounded p-5">
            <h2 className="text-xl font-semibold">Total Students</h2>
            <p className="text-4xl font-bold mt-2">{totalStudents}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-xl font-semibold">Present</h2>
            <p className="text-4xl font-bold mt-2">{presentCount}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-xl font-semibold">Late</h2>
            <p className="text-4xl font-bold mt-2">{lateCount}</p>
          </div>

          <div className="bg-white shadow rounded p-5">
            <h2 className="text-xl font-semibold">Absent</h2>
            <p className="text-4xl font-bold mt-2">{absentCount}</p>
          </div>
        </div>

        {(showForm || editingStudent) && (
          <StudentForm
            students={students}
            setStudents={setStudents}
            editingStudent={editingStudent}
            setEditingStudent={setEditingStudent}
            setShowForm={setShowForm}
          />
        )}

        <StudentList
          students={students}
          setStudents={setStudents}
          setEditingStudent={setEditingStudent}
        />
      </div>
    </div>
  );
};

export default TeacherDashboard;
