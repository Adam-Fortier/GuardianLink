import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch volunteers when the component mounts
        api.get('/volunteers')
            .then((res) => setVolunteers(res.data))
            .catch((err) => setError('Failed to fetch volunteers.'));
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>Volunteer List</h1>
            {volunteers.length === 0 ? (
                <p>No volunteers available.</p>
            ) : (
                <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Hours Available</th>
                            <th>Skills</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map((volunteer) => (
                            <tr key={volunteer.id}>
                                <td>{volunteer.firstName}</td>
                                <td>{volunteer.lastName}</td>
                                <td>{volunteer.email}</td>
                                <td>{volunteer.hoursAvailable}</td>
                                <td>{volunteer.skills}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default VolunteerList;
