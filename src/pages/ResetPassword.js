import React, { useState } from 'react';
import api from '../utils/api';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await api.post('/auth/reset-password', { token, newPassword });
            setMessage('Password reset successful!');
        } catch (err) {
            setError('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className="container mt-5">
            <h1>Reset Password</h1>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;
