import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const VolunteerList = () => {
    const [volunteers, setVolunteers] = useState([]);

    useEffect(() => {
        // Fetch volunteers from the API
        api.get('/volunteers')
            .then(res => setVolunteers(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>Volunteers</h1>
            <ul>
                {volunteers.map(volunteer => (
                    <li key={volunteer.id}>
                        {volunteer.name} - {volunteer.availability_hours} hours/week
                        <a
                            href={`mailto:${volunteer.email}?subject=Volunteer Opportunity&body=Hello ${volunteer.name},`}
                        >
                            Contact
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default VolunteerList;
