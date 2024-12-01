import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setIsLoggedIn, setUser }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
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
        <div className="retro-container mt-12 mx-auto max-w-md p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-4xl font-bold mb-6 terminal-heading">Login</h1>
            {errorMessage && (
                <div className="alert alert-danger bg-red-700 text-white font-bold p-2 rounded mb-4">
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="alert alert-success bg-green-700 text-white font-bold p-2 rounded mb-4">
                    {successMessage}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium terminal-text">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full border border-gray-600 rounded p-2 bg-gray-800 text-white terminal-input"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium terminal-text">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="w-full border border-gray-600 rounded p-2 bg-gray-800 text-white terminal-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="retro-btn btn-primary w-full mt-4">
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
