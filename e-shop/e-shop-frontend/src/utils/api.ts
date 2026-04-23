import axios from 'axios';

const API = axios.create({
  // This is your backend server address
  baseURL: 'http://localhost:5000/api',
});

// This automatically adds the token from localStorage to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;