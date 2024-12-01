import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        role: 'volunteer',
        firstName: '',
        lastName: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error('Error fetching users:', err.message);
            alert('Failed to fetch users.');
        }
    };

    // Handle input change for new user form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser({ ...newUser, [name]: value });
    };

    // Handle add new user submission
    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            console.log('Creating new user:', newUser);
            await api.post('/admin/add-user', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('User profile created successfully!');
            setNewUser({
                email: '',
                password: '',
                role: 'volunteer',
                firstName: '',
                lastName: '',
            });
            fetchUsers(); // Refresh the user list after adding a new user
        } catch (err) {
            console.error('Error creating user:', err.message);
            alert('Failed to create user profile. Please try again.');
        }
    };

    // Handle role change for an existing user
    const handleRoleChange = async (id, role) => {
        try {
            console.log(`Changing role for user ID: ${id} to ${role}`);
            await api.patch(`/admin/users/${id}`, { role }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Update the UI after a successful role change
            setUsers(users.map((user) => (user.id === id ? { ...user, role } : user)));
            alert('User role updated successfully');
        } catch (err) {
            console.error('Failed to update user role:', err.message);
            alert('Failed to update role.');
        }
    };

    // Handle deleting a user
    const handleDelete = async (id) => {
        try {
            console.log(`Deleting user with ID: ${id}`);
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter((user) => user.id !== id));
            alert('User deleted successfully');
        } catch (err) {
            console.error('Failed to delete user:', err.message);
            alert('Failed to delete user.');
        }
    };

    // Handle sending password reset link
    const handleSendResetLink = async (email) => {
        try {
            console.log(`Sending password reset link to: ${email}`);
            await api.post('/auth/forgot-password', { email });
            alert(`Password reset link sent to ${email}`);
        } catch (err) {
            console.error('Failed to send reset password link:', err.message);
            alert('Failed to send reset password link.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

            {/* Create New User Section */}
            <form onSubmit={handleAddUser} className="mb-5">
                <h2 className="text-2xl font-bold mb-3">Create New User</h2>
                <div className="form-group mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="password" className="form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="role" className="form-label">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={newUser.role}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    >
                        <option value="volunteer">Volunteer</option>
                        <option value="ngo">NGO</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="firstName" className="form-label">First Name:</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={newUser.firstName}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={newUser.lastName}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create User</button>
            </form>

            {/* User List Section */}
            <h2 className="text-2xl font-bold mb-3">User List</h2>
            <table className="table table-bordered">
                <thead className="thead-light">
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="form-control"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="ngo">NGO</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="btn btn-danger me-2"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleSendResetLink(user.email)}
                                    className="btn btn-warning"
                                >
                                    Send Reset Password Link
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
