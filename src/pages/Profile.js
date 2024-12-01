import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('Fetching profile data...');
                const response = await api.get('/auth/profile'); // Adjusted endpoint
                console.log('Profile data fetched:', response.data);
                setProfile(response.data);
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to fetch profile.');
            }
        };

        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            console.log('Updating profile:', profile);
            await api.patch('/auth/profile', profile); // Adjusted endpoint
            setMessage('Profile updated successfully!');
            setError('');
        } catch (err) {
            console.error('Failed to update profile:', err);
            setMessage('');
            setError('Failed to update profile.');
        }
    };

    const handleDeleteProfile = async () => {
        if (window.confirm('Are you sure you want to delete your profile? This action cannot be undone.')) {
            try {
                console.log('Deleting profile...');
                await api.delete('/auth/delete-profile');
                setMessage('Profile deleted successfully.');
                setTimeout(() => {
                    localStorage.clear();
                    window.location.href = '/login';
                }, 1500);
            } catch (err) {
                console.error('Failed to delete profile:', err);
                setMessage('');
                setError('Failed to delete profile.');
            }
        }
    };

    if (error) {
        return <p className="alert alert-danger bg-red-700 text-white font-bold p-2 rounded mb-4 terminal-text">{error}</p>;
    }

    if (!profile) {
        return <p className="text-yellow-400 text-center mt-4 terminal-text">Loading...</p>;
    }

    return (
        <div className="retro-container max-w-3xl mx-auto p-6 border border-gray-400 rounded-lg bg-gray-900 text-white terminal-text">
            <h1 className="text-4xl font-bold mb-6 terminal-heading">Profile</h1>
            {message && <p className="bg-green-600 text-white font-bold p-2 rounded mb-4 terminal-text">{message}</p>}
            <form onSubmit={handleUpdate} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-2">First Name:</label>
                    <input
                        type="text"
                        value={profile.firstName || ''}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Last Name:</label>
                    <input
                        type="text"
                        value={profile.lastName || ''}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        value={profile.email || ''}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                    />
                </div>
                {profile.role === 'ngo' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-2">Organization Name:</label>
                            <input
                                type="text"
                                value={profile.organizationName || ''}
                                onChange={(e) => setProfile({ ...profile, organizationName: e.target.value })}
                                className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Areas of Concern:</label>
                            <input
                                type="text"
                                value={profile.areasOfConcern || ''}
                                onChange={(e) => setProfile({ ...profile, areasOfConcern: e.target.value })}
                                className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                            />
                        </div>
                    </>
                )}
                {profile.role === 'volunteer' && (
                    <>
                        <div>
                            <label className="block text-sm font-bold mb-2">Hours Available Per Week:</label>
                            <input
                                type="number"
                                value={profile.hoursAvailable || ''}
                                onChange={(e) => setProfile({ ...profile, hoursAvailable: e.target.value })}
                                className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Skills:</label>
                            <input
                                type="text"
                                value={profile.skills || ''}
                                onChange={(e) => setProfile({ ...profile, skills: e.target.value })}
                                className="w-full p-2 border border-gray-500 rounded bg-gray-800 text-white"
                            />
                        </div>
                    </>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    Update Profile
                </button>
            </form>
            <button
                onClick={handleDeleteProfile}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
                Delete Profile
            </button>
        </div>
    );
};

export default Profile;

