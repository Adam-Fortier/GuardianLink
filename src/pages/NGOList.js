import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NGOList = () => {
    const [ngos, setNGOs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNGOs = async () => {
            try {
                console.log('Fetching NGOs...');
                const response = await api.get('/ngos', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the JWT token is passed
                    }
                });
                setNGOs(response.data);
                console.log('NGOs fetched successfully:', response.data);
            } catch (err) {
                console.error('Error fetching NGOs:', err.message);
                setError('Failed to fetch NGOs.');
            }
        };

        fetchNGOs();
    }, []);

    if (error) {
        return <p className="alert alert-danger bg-red-700 text-white font-bold p-2 rounded mb-4 terminal-text">{error}</p>;
    }

    return (
        <div className="retro-container mt-12 mx-auto max-w-4xl p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-4xl font-bold mb-6 terminal-heading">NGO List</h1>
            {ngos.length === 0 ? (
                <p className="text-yellow-400">No NGOs available.</p>
            ) : (
                <table className="w-full border border-gray-600 text-left terminal-table">
                    <thead>
                        <tr className="bg-gray-800 text-white">
                            <th className="p-4 border-b border-gray-700">Organization Name</th>
                            <th className="p-4 border-b border-gray-700">First Name</th>
                            <th className="p-4 border-b border-gray-700">Last Name</th>
                            <th className="p-4 border-b border-gray-700">Email</th>
                            <th className="p-4 border-b border-gray-700">Areas of Concern</th>
                            <th className="p-4 border-b border-gray-700">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ngos.map((ngo) => (
                            <tr key={ngo.id} className="hover:bg-gray-800">
                                <td className="p-4 border-b border-gray-700">{ngo.organization_name}</td>
                                <td className="p-4 border-b border-gray-700">{ngo.first_name}</td>
                                <td className="p-4 border-b border-gray-700">{ngo.last_name}</td>
                                <td className="p-4 border-b border-gray-700">{ngo.email}</td>
                                <td className="p-4 border-b border-gray-700">{ngo.areas_of_concern}</td>
                                <td className="p-4 border-b border-gray-700">
                                    <a className="nav-link hover:text-yellow-400" href={`mailto:${ngo.email}`}>Contact</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default NGOList;
