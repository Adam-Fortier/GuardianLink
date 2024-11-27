import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ isLoggedIn, role }) => {
    return (
        <header style={{ padding: '10px', backgroundColor: '#f4f4f4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <nav>
                {/* Home Link */}
                <Link to="/" style={{ margin: '0 10px', textDecoration: 'none' }}>Home</Link>
                
                {/* Conditional Links for Login/Register */}
                {!isLoggedIn ? (
                    <>
                        <Link to="/login" style={{ margin: '0 10px', textDecoration: 'none' }}>Login</Link>
                        <Link to="/register" style={{ margin: '0 10px', textDecoration: 'none' }}>Register</Link>
                    </>
                ) : (
                    <>
                        {/* Role-Based Links */}
                        {role === 'ngo' && (
                            <Link to="/volunteers" style={{ margin: '0 10px', textDecoration: 'none' }}>View Volunteers</Link>
                        )}
                        {role === 'volunteer' && (
                            <Link to="/ngos" style={{ margin: '0 10px', textDecoration: 'none' }}>View NGOs</Link>
                        )}

                        {/* Logout Button */}
                        <button
                            style={{
                                margin: '0 10px',
                                backgroundColor: '#ff4d4d',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                localStorage.clear();
                                window.location.href = '/login'; // Redirect to Login after logout
                            }}
                        >
                            Logout
                        </button>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
