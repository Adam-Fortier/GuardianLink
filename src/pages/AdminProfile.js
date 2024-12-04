import React from 'react';

const AdminProfile = () => {
    return (
        <section className="admin-profile-container">
            <h1 className="admin-profile-title">Admin Profile</h1>
            <p className="admin-profile-description">
                As an admin, you have access to advanced platform settings to manage the system effectively.
            </p>
            <ul className="admin-profile-list">
                <li>Manage users and permissions</li>
                <li>Monitor platform activities and reports</li>
                <li>Update and enforce organizational policies</li>
                <li>Oversee platform security</li>
            </ul>
        </section>
    );
};

export default AdminProfile;
