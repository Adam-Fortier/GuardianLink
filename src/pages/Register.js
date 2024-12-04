import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

// Register component to handle user registration
const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('volunteer');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        organizationName: '',
        email: '',
        password: '',
        areasOfConcern: '',
        hoursAvailablePerWeek: '',
        criminalBackgroundCheck: null,
        resume: null,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Prepopulate the role if provided from navigation
    useEffect(() => {
        if (location.state && location.state.role) {
            setRole(location.state.role);
        }
    }, [location.state]);

    // Handle changes in role selection
    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            organizationName: '',
            areasOfConcern: '',
            hoursAvailablePerWeek: '',
            criminalBackgroundCheck: null,
            resume: null,
        }));
    };

    // Handle form field input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file inputs for upload fields
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    // Handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Custom validation for required fields
        if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
            setError('Please fill in all required fields.');
            return;
        }

        if (role === 'ngo' && (!formData.organizationName || !formData.areasOfConcern)) {
            setError('Please fill in all required fields for NGO registration.');
            return;
        }

        if (role === 'volunteer') {
            if (!formData.hoursAvailablePerWeek) {
                setError('Please specify hours available per week.');
                return;
            }
            if (!formData.criminalBackgroundCheck) {
                setError('Criminal Background Check is required for volunteers.');
                return;
            }
            if (!formData.resume) {
                setError('Resume is required for volunteers.');
                return;
            }
        }

        // Prepare form data for submission
        const data = new FormData();
        data.append('role', role);
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);
        data.append('email', formData.email);
        data.append('password', formData.password);

        if (role === 'ngo') {
            data.append('organizationName', formData.organizationName);
            data.append('areasOfConcern', formData.areasOfConcern);
        } else if (role === 'volunteer') {
            data.append('hoursAvailablePerWeek', formData.hoursAvailablePerWeek);
            if (formData.criminalBackgroundCheck) {
                data.append('criminalBackgroundCheck', formData.criminalBackgroundCheck);
            }
            if (formData.resume) {
                data.append('resume', formData.resume);
            }
        }

        // API call to register the user
        try {
            await api.post('/auth/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage('Registration successful!');
            setFormData({
                firstName: '',
                lastName: '',
                organizationName: '',
                email: '',
                password: '',
                areasOfConcern: '',
                hoursAvailablePerWeek: '',
                criminalBackgroundCheck: null,
                resume: null,
            });
            setRole('volunteer'); // Reset role to default
            navigate('/login');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="retro-container max-w-lg mx-auto p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-3xl font-bold mb-6">Register</h1>
            {message && (
                <div className="alert alert-success bg-green-700 text-white font-bold p-2 rounded mb-4">
                    {message}
                </div>
            )}
            {error && (
                <div className="alert alert-danger bg-red-700 text-white font-bold p-2 rounded mb-4">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 register-form" noValidate>
                <div className="input-container">
                    <label htmlFor="firstName" className="form-label">
                        First Name:
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        className="form-input"
                        placeholder="Enter your first name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="lastName" className="form-label">
                        Last Name:
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        className="form-input"
                        placeholder="Enter your last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="email" className="form-label">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password" className="form-label">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="form-input"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="role" className="form-label">
                        Role:
                    </label>
                    <select
                        id="role"
                        name="role"
                        className="form-input"
                        value={role}
                        onChange={handleRoleChange}
                        required
                    >
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                    </select>
                </div>

                {role === 'ngo' && (
                    <>
                        <div className="input-container">
                            <label htmlFor="organizationName" className="form-label">
                                Organization Name:
                            </label>
                            <input
                                type="text"
                                id="organizationName"
                                name="organizationName"
                                className="form-input"
                                placeholder="Enter organization name"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="areasOfConcern" className="form-label">
                                Areas of Concern:
                            </label>
                            <textarea
                                id="areasOfConcern"
                                name="areasOfConcern"
                                className="form-input"
                                placeholder="Describe your areas of concern"
                                value={formData.areasOfConcern}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </>
                )}

                {role === 'volunteer' && (
                    <>
                        <div className="input-container">
                            <label htmlFor="hoursAvailablePerWeek" className="form-label">
                                Hours Available Per Week:
                            </label>
                            <input
                                type="number"
                                id="hoursAvailablePerWeek"
                                name="hoursAvailablePerWeek"
                                className="form-input"
                                placeholder="Enter hours available"
                                value={formData.hoursAvailablePerWeek}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="criminalBackgroundCheck" className="form-label">
                                Criminal Background Check:
                            </label>
                            <input
                                type="file"
                                id="criminalBackgroundCheck"
                                name="criminalBackgroundCheck"
                                className="form-input"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                        <div className="input-container">
                            <label htmlFor="resume" className="form-label">
                                Resume:
                            </label>
                            <input
                                type="file"
                                id="resume"
                                name="resume"
                                className="form-input"
                                onChange={handleFileChange}
                                required
                            />
                        </div>
                    </>
                )}

                <button type="submit" className="btn-primary w-full mt-4">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
