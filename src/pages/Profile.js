import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/auth/profile');
                setProfile(response.data);
            } catch (err) {
                setError('Failed to fetch profile.');
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.patch('/auth/profile', profile);
            setMessage('Profile updated successfully!');
            setError('');
        } catch (err) {
            setMessage('');
            setError('Failed to update profile.');
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                await api.delete('/auth/delete-profile');
                setMessage('Profile deleted successfully.');
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }, 1500);
            } catch (err) {
                setMessage('');
                setError('Failed to delete profile.');
            }
        }
    };

    if (error) {
        return <p className="alert alert-danger">{error}</p>;
    }

    if (!profile) {
        return <p className="loading-message">Loading...</p>;
    }

    return (
        <section className="profile-container">
            <h1>Profile</h1>
            {message && <p className="success-message">{message}</p>}
            <form className="profile-form" onSubmit={handleUpdate}>
                <label htmlFor="first-name">First Name:</label>
                <input
                    type="text"
                    id="first-name"
                    value={profile.firstName || ''}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    placeholder="Enter your first name"
                />

                <label htmlFor="last-name">Last Name:</label>
                <input
                    type="text"
                    id="last-name"
                    value={profile.lastName || ''}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    placeholder="Enter your last name"
                />

                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={profile.email || ''}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="Enter your email"
                />

                {profile.role === 'ngo' && (
                    <>
                        <label htmlFor="organization-name">Organization Name:</label>
                        <input
                            type="text"
                            id="organization-name"
                            value={profile.organizationName || ''}
                            onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                            placeholder="Enter organization name"
                        />

                        <label htmlFor="areas-of-concern">Areas of Concern:</label>
                        <input
                            type="text"
                            id="areas-of-concern"
                            value={profile.areasOfConcern || ''}
                            onChange={(e) => setProfile({ ...profile, areasOfConcern: e.target.value })}
                            placeholder="Enter areas of concern"
                        />
                    </>
                )}

                {profile.role === 'volunteer' && (
                    <>
                        <label htmlFor="hours-available">Hours Available Per Week:</label>
                        <input
                            type="number"
                            id="hours-available"
                            value={profile.hoursAvailable || ''}
                            onChange={(e) => setProfile({ ...profile, hoursAvailable: e.target.value })}
                            placeholder="Enter hours available"
                        />

                        <label htmlFor="skills">Skills:</label>
                        <input
                            type="text"
                            id="skills"
                            value={profile.skills || ''}
                            onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                            placeholder="Enter your skills"
                        />
                    </>
                )}

                <button type="submit" className="btn-primary">
                    Update Profile
                </button>
            </form>
            <button onClick={handleDeleteProfile} className="delete-profile-btn">
                Delete Profile
            </button>
        </section>
    );
};

export default Profile;
