import React, { useState } from 'react';
import axios from 'axios'; // Use axios directly 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // To display login errors
    const [successMessage, setSuccessMessage] = useState(''); // To display success

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setErrorMessage(''); // Reset error message
        setSuccessMessage(''); // Reset success message

        try {
            const response = await axios.post('http://localhost:8080/login', {
                email,
                password,
            });

            // Store the token and user data
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Show success message
            setSuccessMessage('Login successful!');
            console.log('User logged in:', response.data.user);
        } catch (err) {
            setErrorMessage('Login failed. Please check your email or password.');
            console.error('Login error:', err);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
