import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, role }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header className="header fixed-header">
            <div className="header-content container">
                {/* Logo */}
                <Link to="/" className="logo">GuardianLink</Link>

                {/* Hamburger Menu Button for Mobile */}
                <button className="menu-btn" onClick={toggleMenu}>
                    ☰
                </button>

                {/* Navigation Links */}
                <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
                    {!isLoggedIn ? (
                        <>
                            <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>Login</Link>
                            <Link to="/register" className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>Register</Link>
                        </>
                    ) : (
                        <>
                            {role === 'ngo' && (
                                <Link to="/volunteers" className={`nav-link ${location.pathname === '/volunteers' ? 'active' : ''}`}>View Volunteers</Link>
                            )}
                            {role === 'volunteer' && (
                                <Link to="/ngos" className={`nav-link ${location.pathname === '/ngos' ? 'active' : ''}`}>View NGOs</Link>
                            )}
                            {role === 'admin' && (
                                <Link to="/admin" className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin Dashboard</Link>
                            )}
                            <button
                                className="logout-btn"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.href = '/login';
                                }}
                            >
                                Logout
                            </button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
