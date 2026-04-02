import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudentForm = ({ students, setStudents, editingStudent, setEditingStudent, onClose }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    course: '',
  });

  useEffect(() => {
    if (editingStudent) {
      setFormData({
        name: editingStudent.name || '',
        studentId: editingStudent.studentId || '',
        email: editingStudent.email || '',
        course: editingStudent.course || '',
      });
    } else {
      setFormData({
        name: '',
        studentId: '',
        email: '',
        course: '',
      });
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        const response = await axiosInstance.put(
          `/api/students/${editingStudent._id}`,
          formData,
          {
            headers: user?.token
              ? { Authorization: `Bearer ${user.token}` }
              : {},
          }
        );

        setStudents(
          students.map((student) =>
            student._id === response.data._id ? response.data : student
          )
        );
      } else {
        const response = await axiosInstance.post('/api/students', formData, {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });

        setStudents([response.data, ...students]);
      }

      setEditingStudent(null);
      setFormData({
        name: '',
        studentId: '',
        email: '',
        course: '',
      });

      if (onClose) onClose();
    } catch (error) {
      alert('Failed to save student.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingStudent ? 'Edit Student' : 'Add Student'}
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Student Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="studentId"
        placeholder="Student ID"
        value={formData.studentId}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Student Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <input
        type="text"
        name="course"
        placeholder="Course"
        value={formData.course}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      />

      <div className="flex gap-3">
        <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded">
          {editingStudent ? 'Update Student' : 'Create Student'}
        </button>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-500 text-white p-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StudentForm;
