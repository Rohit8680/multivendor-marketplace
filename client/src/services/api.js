import axios from 'axios';

// Detect if running live on Vercel or locally
const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // If Vercel env variable is set, use it, else default to relative or live API fallback
    return import.meta.env.VITE_API_URL || '/api';
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseURL()
});

// Interceptor to attach Authorization Bearer token from localStorage
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Format API response error message
export const getErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return error.message || 'An unexpected error occurred';
};

export default API;
