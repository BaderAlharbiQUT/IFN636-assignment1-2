import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const StudentForm = ({ students, setStudents, editingStudent, setEditingStudent }) => {
  const { user } = useAuth();

  // Form fields for one student record
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    course: '',
    attendanceStatus: '',
  });

  useEffect(() => {
    // If editing, load selected student data into the form
    if (editingStudent) {
      let status = '';
      if (editingStudent.present > 0) status = 'Present';
      else if (editingStudent.absent > 0) status = 'Absent';
      else if (editingStudent.late > 0) status = 'Late';

      setFormData({
        name: editingStudent.name || '',
        studentId: editingStudent.studentId || '',
        email: editingStudent.email || '',
        course: editingStudent.course || '',
        attendanceStatus: status,
      });
    } else {
      // Otherwise reset the form for creating a new student
      setFormData({
        name: '',
        studentId: '',
        email: '',
        course: '',
        attendanceStatus: '',
      });
    }
  }, [editingStudent]);

  // Update form field values when typing
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert attendanceStatus into backend fields
    const payload = {
      name: formData.name,
      studentId: formData.studentId,
      email: formData.email,
      course: formData.course,
      totalDays: 1,
      present: formData.attendanceStatus === 'Present' ? 1 : 0,
      absent: formData.attendanceStatus === 'Absent' ? 1 : 0,
      late: formData.attendanceStatus === 'Late' ? 1 : 0,
      attendanceRate: formData.attendanceStatus === 'Present' ? 100 : 0,
    };

    try {
      if (editingStudent) {
        const response = await axiosInstance.put(
          `/api/students/${editingStudent._id}`,
          payload,
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
        const response = await axiosInstance.post('/api/students', payload, {
          headers: user?.token
            ? { Authorization: `Bearer ${user.token}` }
            : {},
        });

        setStudents([...students, response.data]);
      }

      setEditingStudent(null);
      setFormData({
        name: '',
        studentId: '',
        email: '',
        course: '',
        attendanceStatus: '',
      });
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

      <select
        name="attendanceStatus"
        value={formData.attendanceStatus}
        onChange={handleChange}
        className="w-full mb-4 p-2 border rounded"
        required
      >
        <option value="">Select Attendance Status</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Late">Late</option>
      </select>

      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {editingStudent ? 'Update Student' : 'Create Student'}
      </button>
    </form>
  );
};

export default StudentForm;
