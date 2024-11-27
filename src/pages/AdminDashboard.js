import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Fetch all users
    useEffect(() => {
        api.get('/admin/users')
            .then((res) => {
                setUsers(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to fetch users.');
                setLoading(false);
            });
    }, []);

    // Delete a user
    const deleteUser = (id) => {
        api.delete(`/admin/users/${id}`)
            .then(() => {
                setUsers(users.filter((user) => user.id !== id));
                setMessage('User deleted successfully.');
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to delete user.');
            });
    };

    // Change user role
    const changeRole = (id, newRole) => {
        api.patch(`/admin/users/${id}/role`, { role: newRole })
            .then(() => {
                setUsers(users.map((user) => (user.id === id ? { ...user, role: newRole } : user)));
                setMessage('Role updated successfully.');
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to update role.');
            });
    };

    // Reset user password
    const resetPassword = (id) => {
        const newPassword = prompt('Enter new password:');
        if (!newPassword) return;

        api.patch(`/admin/users/${id}/password`, { newPassword })
            .then(() => setMessage('Password reset successfully.'))
            .catch((err) => {
                console.error(err);
                setError('Failed to reset password.');
            });
    };

    if (loading) return <p>Loading users...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Firstname</th>
                        <th>Lastname</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.Firstname}</td>
                            <td>{user.Lastname}</td>
                            <td>{user.email}</td>
                            <td>
                                <select
                                    value={user.role}
                                    onChange={(e) => changeRole(user.id, e.target.value)}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="ngo">NGO</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </td>
                            <td>
                                <button onClick={() => resetPassword(user.id)}>Reset Password</button>
                                <button onClick={() => deleteUser(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
