import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerList from './pages/VolunteerList';
import NGOList from './pages/NGOList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import './App.css'; // Import the CSS file for styling

// Main app component
const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    // On initial load, checking for token and user in localStorage to restore session
    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Handling logout functionality
    const handleLogout = () => {
        localStorage.clear();
        setIsLoggedIn(false);
        setUser(null);
        window.location.replace('/login');
    };

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} role={user?.role} onLogout={handleLogout} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile user={user} /> : <Navigate to="/login" />}
                />
                <Route
                    path="/volunteers"
                    element={isLoggedIn && user?.role === 'ngo' ? <VolunteerList /> : <Navigate to="/login" />}
                />
                <Route
                    path="/ngos"
                    element={isLoggedIn && user?.role === 'volunteer' ? <NGOList /> : <Navigate to="/login" />}
                />
                <Route
                    path="/admin"
                    element={isLoggedIn && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;
