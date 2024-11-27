import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
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
        <div className="container mt-5">
            <h1>Login</h1>
            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        className="form-control"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
                <p className="mt-3">
                    <a href="/forgot-password">Forgot Password?</a>
                </p>
            </form>
        </div>
    );
};

export default Login;

