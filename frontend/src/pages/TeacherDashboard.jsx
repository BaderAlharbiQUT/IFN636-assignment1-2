import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';
import { useAuth } from '../context/AuthContext';

const TeacherDashboard = () => {
  const { user } = useAuth();

  // Store all students from the backend
  const [students, setStudents] = useState([]);

  // Store the student currently being edited
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    // Fetch all student records when the page loads
    const fetchStudents = async () => {
      try {
        const response = await axiosInstance.get('/api/students', {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });
        setStudents(response.data);
      } catch (error) {
        alert('Failed to fetch students.');
      }
    };

    fetchStudents();
  }, [user]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Teacher Dashboard</h1>

      {/* Form for creating and updating students */}
      <StudentForm
        students={students}
        setStudents={setStudents}
        editingStudent={editingStudent}
        setEditingStudent={setEditingStudent}
      />

      {/* List of all student records */}
      <StudentList
        students={students}
        setStudents={setStudents}
        setEditingStudent={setEditingStudent}
      />
    </div>
  );
};

export default TeacherDashboard;
