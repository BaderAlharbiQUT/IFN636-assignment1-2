import axios from 'axios';

const API_BASE_URL =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5001'
    : 'http://54.253.48.157:5001';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser?.token) {
      config.headers.Authorization = `Bearer ${parsedUser.token}`;
    }
  }

  return config;
});

export default axiosInstance;
