import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        api.get('/admin/users')
            .then((res) => setUsers(res.data))
            .catch(() => alert('Failed to fetch users.'));
    }, []);

    const handleRoleChange = (id, role) => {
        api.patch(`/admin/users/${id}`, { role })
            .then(() => setUsers(users.map((u) => (u.id === id ? { ...u, role } : u))))
            .catch(() => alert('Failed to update role.'));
    };

    const handleDelete = (id) => {
        api.delete(`/admin/users/${id}`)
            .then(() => setUsers(users.filter((u) => u.id !== id)))
            .catch(() => alert('Failed to delete user.'));
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Name</th>
                        <th className="border border-gray-300 p-2">Email</th>
                        <th className="border border-gray-300 p-2">Role</th>
                        <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td className="border border-gray-300 p-2">{user.name}</td>
                            <td className="border border-gray-300 p-2">{user.email}</td>
                            <td className="border border-gray-300 p-2">
                                <select
                                    value={user.role}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    className="border rounded p-1"
                                >
                                    <option value="admin">Admin</option>
                                    <option value="ngo">NGO</option>
                                    <option value="volunteer">Volunteer</option>
                                </select>
                            </td>
                            <td className="border border-gray-300 p-2">
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded"
                                >
                                    Delete
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

