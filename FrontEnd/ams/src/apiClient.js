import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // We'll set this up in the next step
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the JWT token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    // Skip adding Authorization for login and signup endpoints
    if (token && !config.url.includes('/auth/login') && !config.url.includes('/auth/signup')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default apiClient;