// Profile.js
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
//import './Profile.css';//

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        api.get('/profile')
            .then((res) => setProfile(res.data))
            .catch((err) => setError('Failed to fetch profile.'));
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        api.patch('/profile', profile)
            .then(() => setMessage('Profile updated successfully!'))
            .catch(() => setError('Failed to update profile.'));
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>Profile</h1>
            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
            <form onSubmit={handleUpdate}>
                <label>
                    Name:
                    <input
                        type="text"
                        value={profile.name || ''}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                </label>
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
