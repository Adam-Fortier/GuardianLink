import React from 'react';
import { useNavigate } from 'react-router-dom';

// Home Component for the homepage content
const Home = () => {
    const navigate = useNavigate();

    // Handle registration based on role selection
    const handleRegister = (role) => {
        navigate('/register', { state: { role } });
    };

    return (
        <div className="home-container text-center mt-12 terminal-text">
            <h1 className="text-4xl font-bold terminal-heading">Welcome to GuardianLink</h1>
            <p className="mt-4 terminal-paragraph">Your platform to connect NGOs with cybersecurity volunteers.</p>
            <div className="mt-8">
                {/* Registration buttons */}
                <button
                    onClick={() => handleRegister('volunteer')}
                    className="btn-primary retro-btn mr-4"
                >
                    Register as Volunteer
                </button>
                <button
                    onClick={() => handleRegister('ngo')}
                    className="btn-secondary retro-btn"
                >
                    Register as NGO
                </button>
            </div>
        </div>
    );
};

export default Home;
