import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const NGOList = () => {
    const [ngos, setNGOs] = useState([]);

    useEffect(() => {
        // Fetch NGOs from the API
        api.get('/ngos')
            .then(res => setNGOs(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div>
            <h1>NGOs</h1>
            <ul>
                {ngos.map(ngo => (
                    <li key={ngo.id}>
                        {ngo.organization_name} - {ngo.areas_of_concern}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NGOList;
