import React, { useState } from 'react';
import api from '../utils/api';

// Forgot Password component to handle password reset requests
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Handle the submission of the forgot password form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            // Make API call to initiate password reset
            await api.post('/auth/forgot-password', { email });
            setMessage('Password reset link sent to your email.');
        } catch (err) {
            setError('Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Forgot Password</h1>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Reset Link</button>
            </form>
        </div>
    );
};

export default ForgotPassword;

