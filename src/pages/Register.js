import React, { useState } from 'react';
import api from '../utils/api';

const Register = () => {
    const [role, setRole] = useState('volunteer');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        organizationName: '',
        areasOfConcern: '',
        hoursAvailable: '',
        resume: null,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setFormData((prevData) => ({
            ...prevData,
            organizationName: '',
            areasOfConcern: '',
            hoursAvailable: '',
            resume: null,
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, resume: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (formData[key]) {
                data.append(key, formData[key]);
            }
        });
        data.append('role', role);

        try {
            await api.post('/register', data);
            setMessage('Registration successful!');
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {message && <p className="text-green-500 mb-4" role="alert">{message}</p>}
            {error && <p className="text-red-500 mb-4" role="alert">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">
                        Email:
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium">
                        Password:
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium">
                        First Name:
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium">
                        Last Name:
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full border rounded p-2"
                        required
                        aria-required="true"
                    />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-medium">
                        Role:
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={handleRoleChange}
                        className="w-full border rounded p-2"
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
                            <label htmlFor="organizationName" className="block text-sm font-medium">
                                Organization Name:
                            </label>
                            <input
                                id="organizationName"
                                type="text"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="areasOfConcern" className="block text-sm font-medium">
                                Areas of Concern:
                            </label>
                            <textarea
                                id="areasOfConcern"
                                name="areasOfConcern"
                                value={formData.areasOfConcern}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2"
                                required
                                aria-required="true"
                            />
                        </div>
                    </>
                )}
                {role === 'volunteer' && (
                    <>
                        <div>
                            <label htmlFor="hoursAvailable" className="block text-sm font-medium">
                                Hours Available Per Week:
                            </label>
                            <input
                                id="hoursAvailable"
                                type="number"
                                name="hoursAvailable"
                                value={formData.hoursAvailable}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2"
                                required
                                aria-required="true"
                            />
                        </div>
                        <div>
                            <label htmlFor="resume" className="block text-sm font-medium">
                                Resume:
                            </label>
                            <input
                                id="resume"
                                type="file"
                                onChange={handleFileChange}
                                className="w-full border rounded p-2"
                                required
                                aria-required="true"
                            />
                        </div>
                    </>
                )}
                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
