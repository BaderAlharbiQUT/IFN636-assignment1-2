import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '54.253.48.157:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
