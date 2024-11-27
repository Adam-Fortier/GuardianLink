import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: 'http://localhost:8080', // Replace with your backend base URL
});

// Add a request interceptor to include authorization header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Add token to headers
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
    (response) => response, // If the response is successful, return it as is
    (error) => {
        // Check if the error is due to an unauthorized request
        if (error.response && error.response.status === 401) {
            localStorage.clear(); // Clear stored user data
            window.location.href = '/login'; // Redirect to login page
        }
        // Optionally, handle other errors here (e.g., show a toast message)
        return Promise.reject(error);
    }
);

export default api;
