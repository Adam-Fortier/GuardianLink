import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isLoggedIn, role, onLogout }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const handleLinkClick = () => setMenuOpen(false);

    return (
        <header className="header fixed-header">
            <div className="header-content container">
                {/* Logo */}
                <Link to="/" className="logo">GuardianLink</Link>

                {/* Hamburger Menu Button for Mobile */}
                <button className="menu-btn" onClick={toggleMenu}>☰</button>

                {/* Navigation Links */}
                <nav className={`nav-links ${menuOpen ? 'show' : ''}`}>
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={handleLinkClick}
                    >
                        Home
                    </Link>
                    <Link
                        to="/about"
                        className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
                        onClick={handleLinkClick}
                    >
                        About Us
                    </Link>
                    {!isLoggedIn ? (
                        <>
                            <Link
                                to="/login"
                                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Register
                            </Link>
                        </>
                    ) : (
                        <>
                            {role === 'ngo' && (
                                <Link
                                    to="/volunteers"
                                    className={`nav-link ${location.pathname === '/volunteers' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    View Volunteers
                                </Link>
                            )}
                            {role === 'volunteer' && (
                                <Link
                                    to="/ngos"
                                    className={`nav-link ${location.pathname === '/ngos' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    View NGOs
                                </Link>
                            )}
                            {role === 'admin' && (
                                <Link
                                    to="/admin"
                                    className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                                    onClick={handleLinkClick}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            <Link
                                to="/profile"
                                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
                                onClick={handleLinkClick}
                            >
                                Profile
                            </Link>
                            <button
                                className="logout-btn"
                                onClick={() => {
                                    onLogout();
                                    handleLinkClick();
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
