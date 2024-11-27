import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch profile data on component mount
        api.get('/profile')
            .then((res) => setProfile(res.data))
            .catch((err) => {
                console.error(err);
                setError('Failed to load profile.');
            });
    }, []);

    const handleUpdate = (e) => {
        e.preventDefault();
        api.patch('/profile', profile)
            .then(() => setMessage('Profile updated successfully.'))
            .catch((err) => {
                console.error(err);
                setError('Failed to update profile.');
            });
    };

    if (!profile) return <p>Loading...</p>;

    return (
        <div>
            <h1>Your Profile</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
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
                {/* Role-specific fields */}
                {profile.role === 'ngo' && (
                    <>
                        <label>
                            Organization Name:
                            <input
                                type="text"
                                value={profile.organizationName || ''}
                                onChange={(e) =>
                                    setProfile({ ...profile, organizationName: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Areas of Concern:
                            <textarea
                                value={profile.areasOfConcern || ''}
                                onChange={(e) =>
                                    setProfile({ ...profile, areasOfConcern: e.target.value })
                                }
                            />
                        </label>
                    </>
                )}
                {profile.role === 'volunteer' && (
                    <>
                        <label>
                            Availability Hours:
                            <input
                                type="number"
                                value={profile.availabilityHours || ''}
                                onChange={(e) =>
                                    setProfile({ ...profile, availabilityHours: e.target.value })
                                }
                            />
                        </label>
                    </>
                )}
                {profile.role === 'admin' && <p>Admins do not have additional profile fields.</p>}
                <button type="submit">Update Profile</button>
            </form>
        </div>
    );
};

export default Profile;
