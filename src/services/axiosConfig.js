import axios from 'axios';
import { API_TOKEN, BASE_URL } from '../utils/constants';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorMessage = error.response?.data?.status_message || error.message;
    const statusCode = error.response?.status;
    
    console.error(`API Error ${statusCode}:`, errorMessage);
    
    // Custom error messages based on status code
    if (statusCode === 404) {
      error.message = 'Resource not found';
    } else if (statusCode === 401) {
      error.message = 'Authentication failed';
    } else if (statusCode === 500) {
      error.message = 'Server error';
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout';
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;