import axios from 'axios';

// Create an axios instance
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080', // Use environment variable or fallback to localhost
    timeout: 10000, // Set a timeout for requests (10 seconds)
});

// Add a request interceptor to include the authorization header
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
        if (error.response) {
            // Unauthorized (401) or Forbidden (403) error handling
            if (error.response.status === 401 || error.response.status === 403) {
                localStorage.clear(); // Clear stored user data
                window.location.href = '/login'; // Redirect to login page
            }
            // Show error message for other statuses
            console.error(
                `API Error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`
            );
        } else if (error.request) {
            // Handle no response received from server
            console.error('No response received from server:', error.request);
        } else {
            // Handle other errors
            console.error('Error during request setup:', error.message);
        }
        return Promise.reject(error);
    }
);

// API utility functions
const getRequest = async (url, config = {}) => {
    try {
        const response = await api.get(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const postRequest = async (url, data, config = {}) => {
    try {
        const response = await api.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const patchRequest = async (url, data, config = {}) => {
    try {
        const response = await api.patch(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

const deleteRequest = async (url, config = {}) => {
    try {
        const response = await api.delete(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Export the axios instance and utility functions
export {
    api as default,
    getRequest,
    postRequest,
    patchRequest,
    deleteRequest
};
