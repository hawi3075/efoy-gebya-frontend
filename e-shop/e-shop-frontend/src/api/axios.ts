import axios from 'axios';

const API = axios.create({
  // This looks for VITE_API_URL in your .env file. 
  // If it doesn't find it, it defaults to localhost so your local testing doesn't break.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches JWT
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error Handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      // Redirecting to login is usually a good idea for UX
      // window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;