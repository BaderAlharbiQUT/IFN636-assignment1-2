import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/login-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
          <h1 className="text-3xl font-bold mb-4 text-center">Register</h1>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mb-4 p-3 border rounded"
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>

          <button type="submit" className="w-full bg-green-600 text-white p-3 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
