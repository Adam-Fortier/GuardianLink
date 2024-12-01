import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState('volunteer');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organizationName: '',
        areasOfConcern: '',
        hoursAvailablePerWeek: '',
        criminalBackgroundCheck: null,
        resume: null,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Set role from location state if provided
    useEffect(() => {
        if (location.state && location.state.role) {
            setRole(location.state.role);
        }
    }, [location.state]);

    // Handle role change (volunteer or NGO)
    const handleRoleChange = (e) => {
        setRole(e.target.value);
        console.log('Role selected:', e.target.value);
        // Reset relevant fields when switching roles
        setFormData((prevData) => ({
            ...prevData,
            organizationName: '',
            areasOfConcern: '',
            hoursAvailablePerWeek: '',
            criminalBackgroundCheck: null,
            resume: null,
        }));
    };

    // Handle input changes for text fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle file change for the criminal background check and resume
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData({ ...formData, [name]: files[0] });
    };

    // Submit form data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Custom validation
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

        // Prepare the data to be submitted
        const data = new FormData();
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('role', role);
        data.append('firstName', formData.firstName);
        data.append('lastName', formData.lastName);

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

        try {
            const response = await api.post('/auth/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Registration successful!');
            console.log('Registration successful!', response.data);

            // Clear the form after successful registration
            setFormData({
                email: '',
                password: '',
                firstName: '',
                lastName: '',
                organizationName: '',
                areasOfConcern: '',
                hoursAvailablePerWeek: '',
                criminalBackgroundCheck: null,
                resume: null,
            });
            setRole('volunteer'); // Reset role to default
            navigate('/login');
        } catch (err) {
            console.error('Error during registration:', err.response?.data || err.message);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="retro-container max-w-lg mx-auto p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-3xl font-bold mb-4 terminal-heading">Register</h1>
            {message && <p className="text-green-400 mb-4" role="alert">{message}</p>}
            {error && <p className="text-red-400 mb-4" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-yellow-300">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 bg-gray-800 text-white"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-yellow-300">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 bg-gray-800 text-white"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-yellow-300">
                        First Name:
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 bg-gray-800 text-white"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-yellow-300">
                        Last Name:
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2 bg-gray-800 text-white"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-yellow-300">
                        Role:
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={handleRoleChange}
                        className="w-full border rounded p-2 bg-gray-800 text-white"
                        required
                        aria-required="true"
                    >
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                    </select>
                </div>
                {role === 'ngo' && (
                    <>
                        <div>
                            <label htmlFor="organizationName" className="block text-sm font-medium text-yellow-300">
                                Organization Name:
                            </label>
                            <input
                                id="organizationName"
                                type="text"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 bg-gray-800 text-white"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="areasOfConcern" className="block text-sm font-medium text-yellow-300">
                                Areas of Concern:
                            </label>
                            <textarea
                                id="areasOfConcern"
                                name="areasOfConcern"
                                value={formData.areasOfConcern}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 bg-gray-800 text-white"
                                required
                                aria-required="true"
                            />
                        </div>
                    </>
                )}
                {role === 'volunteer' && (
                    <>
                        <div>
                            <label htmlFor="hoursAvailablePerWeek" className="block text-sm font-medium text-yellow-300">
                                Hours Available Per Week:
                            </label>
                            <input
                                id="hoursAvailablePerWeek"
                                type="number"
                                name="hoursAvailablePerWeek"
                                value={formData.hoursAvailablePerWeek}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 bg-gray-800 text-white"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="criminalBackgroundCheck" className="block text-sm font-medium text-yellow-300">
                                Criminal Background Check:
                            </label>
                            <input
                                id="criminalBackgroundCheck"
                                type="file"
                                name="criminalBackgroundCheck"
                                onChange={handleFileChange}
                                className="w-full border rounded p-2 bg-gray-800 text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium text-yellow-300">
                                Resume:
                            </label>
                            <input
                                id="resume"
                                type="file"
                                name="resume"
                                onChange={handleFileChange}
                                className="w-full border rounded p-2 bg-gray-800 text-white"
                                required
                                aria-required="true"
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="btn btn-primary bg-yellow-500 text-black hover:bg-yellow-600 p-2 rounded mt-4">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
