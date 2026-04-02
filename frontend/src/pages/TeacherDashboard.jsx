import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../axiosConfig';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/students', {
        headers: user?.token
          ? { Authorization: `Bearer ${user.token}` }
          : {},
      });
      setStudents(response.data);
    } catch (error) {
      alert('Failed to fetch students.');
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const totalStudents = students.length;
  const totalPresent = students.reduce((sum, student) => sum + (student.presentCount || 0), 0);
  const totalLate = students.reduce((sum, student) => sum + (student.lateCount || 0), 0);
  const totalAbsent = students.reduce((sum, student) => sum + (student.absentCount || 0), 0);

  const handleAddStudentClick = () => {
    setEditingStudent(null);
    setShowForm(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setShowForm(true);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <button
          onClick={handleAddStudentClick}
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          Add Student
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Total Students</h3>
          <p className="text-2xl font-bold">{totalStudents}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Present</h3>
          <p className="text-2xl font-bold">{totalPresent}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Late</h3>
          <p className="text-2xl font-bold">{totalLate}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Absent</h3>
          <p className="text-2xl font-bold">{totalAbsent}</p>
        </div>
      </div>

      {showForm && (
        <StudentForm
          students={students}
          setStudents={setStudents}
          editingStudent={editingStudent}
          setEditingStudent={setEditingStudent}
          onClose={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
        />
      )}

      <StudentList
        students={students}
        setStudents={setStudents}
        setEditingStudent={handleEditStudent}
        refreshStudents={fetchStudents}
      />
    </div>
  );
};

export default TeacherDashboard;
