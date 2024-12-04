// axiosInstance.js
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL:  'http://127.0.0.1:8000', 
  headers: { 
    'Content-Type': 'application/json' 
  },
  timeout: 5000, 
});

// Request Interceptor: Add Authorization Token if available
// axiosInstance.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token'); // Get token from local storage
//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`; // Add token to headers
//     }
//     return config;
//   },
//   error => Promise.reject(error) // Reject promise on request error
// );

// Response Interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
  response => response, // Return response as is if successful
  error => {
    console.error('API Error:', error); // Log errors for debugging
    if (error.response?.status === 401) {
      // Example: Redirect to login on Unauthorized (401) error
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Handle Forbidden (403) error
      console.error('Access denied. You do not have the right permissions.');
    } else if (error.response?.status === 500) {
      // Handle Internal Server Error (500)
      console.error('Server error. Please try again later.');
      window.location.href='/server-error'
    }
    return Promise.reject(error); // Reject the error for further handling
  }
);

export default axiosInstance;
