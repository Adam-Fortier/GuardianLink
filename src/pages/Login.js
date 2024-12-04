import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

// Login Component for user authentication
const Login = ({ setIsLoggedIn, setUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle the submission of the login form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Make API call to login user
            const response = await api.post('/auth/login', {
                email,
                password,
            });

            // Store the token and user data in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            setSuccessMessage('Login successful!');

            // Update state in App component
            setIsLoggedIn(true);
            setUser(response.data.user);

            // Redirect based on user role
            const role = response.data.user.role;
            if (role === 'admin') {
                navigate('/admin');
            } else if (role === 'ngo') {
                navigate('/volunteers');
            } else if (role === 'volunteer') {
                navigate('/ngos');
            } else {
                navigate('/');
            }
        } catch (err) {
            setErrorMessage('Login failed. Please check your email or password.');
            console.error('Login error:', err);
        }
    };

    return (
        <div className="login-container max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="login-title text-3xl font-bold text-black mb-6 text-center">
                Login
            </h1>
            {errorMessage && (
                <div className="alert alert-danger error-message p-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success success-message p-2 rounded mb-4">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="input-container">
                    <label htmlFor="email" className="form-label text-black">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password" className="form-label text-black">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn-primary w-full mt-4">
                    Login
                </button>
                <p className="mt-6 text-center">
                    <a href="/forgot-password" className="nav-link hover:text-yellow-400">
                        Forgot Password?
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Login;
