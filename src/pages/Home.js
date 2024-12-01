import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const handleRegister = (role) => {
        navigate('/register', { state: { role } });
    };

    return (
        <div className="home-container text-center mt-12 terminal-text">
            <h1 className="text-4xl font-bold terminal-heading">Welcome to GuardianLink</h1>
            <p className="mt-4 terminal-paragraph">Your platform to connect NGOs with cybersecurity volunteers.</p>
            <div className="mt-8">
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
