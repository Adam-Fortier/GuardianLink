import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NGOList = () => {
    const [ngos, setNGOs] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch NGOs when the component mounts
        api.get('/ngos')
            .then((res) => setNGOs(res.data))
            .catch((err) => setError('Failed to fetch NGOs.'));
    }, []);

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h1>NGO List</h1>
            {ngos.length === 0 ? (
                <p>No NGOs available.</p>
            ) : (
                <table border="1" style={{ width: '100%', textAlign: 'left' }}>
                    <thead>
                        <tr>
                            <th>Organization Name</th>
                            <th>Email</th>
                            <th>Areas of Concern</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ngos.map((ngo) => (
                            <tr key={ngo.id}>
                                <td>{ngo.organizationName}</td>
                                <td>{ngo.email}</td>
                                <td>{ngo.areasOfConcern}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default NGOList;

