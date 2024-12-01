import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch volunteers when the component mounts
        const fetchVolunteers = async () => {
            try {
                console.log('Fetching volunteers...');
                const response = await api.get('/volunteers', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    }
                });
                setVolunteers(response.data);
                console.log('Volunteers fetched successfully:', response.data);
            } catch (err) {
                console.error('Error fetching volunteers:', err.message);
                setError('Failed to fetch volunteers.');
            }
        };

        fetchVolunteers();
    }, []);

    if (error) {
        return <p className="alert alert-danger bg-red-700 text-white font-bold p-2 rounded mb-4 terminal-text">{error}</p>;
    }

    return (
        <div className="retro-container max-w-5xl mx-auto p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-4xl font-bold mb-6 terminal-heading">Volunteer List</h1>
            {volunteers.length === 0 ? (
                <p className="text-yellow-400 text-center mt-4">No volunteers available.</p>
            ) : (
                <table className="table-auto w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-800">
                            <th className="border border-gray-600 p-2 text-left">First Name</th>
                            <th className="border border-gray-600 p-2 text-left">Last Name</th>
                            <th className="border border-gray-600 p-2 text-left">Email</th>
                            <th className="border border-gray-600 p-2 text-left">Hours Available Per Week</th>
                            <th className="border border-gray-600 p-2 text-left">Criminal Background Check</th>
                            <th className="border border-gray-600 p-2 text-left">Resume</th>
                            <th className="border border-gray-600 p-2 text-left">Contact</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map((volunteer) => (
                            <tr key={volunteer.id} className="hover:bg-gray-800">
                                <td className="border border-gray-600 p-2">{volunteer.first_name}</td>
                                <td className="border border-gray-600 p-2">{volunteer.last_name}</td>
                                <td className="border border-gray-600 p-2">{volunteer.email}</td>
                                <td className="border border-gray-600 p-2">{volunteer.hours_available_per_week || 'N/A'}</td>
                                <td className="border border-gray-600 p-2">
                                    {volunteer.criminal_background_check ? (
                                        <a
                                            href={volunteer.criminal_background_check}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline hover:text-blue-600"
                                        >
                                            View Attachment
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="border border-gray-600 p-2">
                                    {volunteer.resume ? (
                                        <a
                                            href={volunteer.resume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 underline hover:text-blue-600"
                                        >
                                            View Resume
                                        </a>
                                    ) : (
                                        'N/A'
                                    )}
                                </td>
                                <td className="border border-gray-600 p-2">
                                    <a
                                        href={`mailto:${volunteer.email}`}
                                        className="text-yellow-400 underline hover:text-yellow-600"
                                    >
                                        Contact
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VolunteerList;
