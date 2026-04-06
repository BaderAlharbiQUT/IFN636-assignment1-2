import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';

const StudentForm = ({
  students,
  setStudents,
  editingStudent,
  setEditingStudent,
  setShowForm,
}) => {
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
    }
  }, [editingStudent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      studentId: '',
      email: '',
      course: '',
    });
    setEditingStudent(null);
    if (setShowForm) setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingStudent) {
        const response = await axiosInstance.put(
          `/api/students/${editingStudent._id}`,
          formData
        );

        setStudents((prevStudents) =>
          prevStudents.map((student) =>
            student._id === editingStudent._id ? response.data : student
          )
        );
      } else {
        const response = await axiosInstance.post('/api/students', formData);
        setStudents([...students, response.data]);
      }

      resetForm();
    } catch (error) {
      console.error('Student form error:', error.response?.data || error.message);
      alert('Failed to save student.');
    }
  };

  return (
    <div className="bg-white shadow rounded p-6 mb-8">
      <h2 className="text-3xl font-bold mb-6">
        {editingStudent ? 'Edit Student' : 'Add Student'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="studentId"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Student Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          name="course"
          placeholder="Course"
          value={formData.course}
          onChange={handleChange}
          className="w-full p-3 border rounded"
          required
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            {editingStudent ? 'Update Student' : 'Create Student'}
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-500 text-white px-6 py-3 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentForm;
