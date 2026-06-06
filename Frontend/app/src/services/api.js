import axios from 'axios';

// Configure the default base setup pointing to your Express engine
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // <-- MAKE SURE THIS MATCHES YOUR BACKEND PORT
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach the JWT Token dynamically to outgoing network packets
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;