import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Components/Header';
import Home from './pages/Home'; 
import Login from './pages/Login';
import Register from './pages/Register';
import VolunteerList from './pages/VolunteerList';
import NGOList from './pages/NGOList';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile'; // Profile page
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard page

const App = () => {
    const isLoggedIn = !!localStorage.getItem('token'); // Check if user is logged in
    const role = localStorage.getItem('role'); // Get user role

    return (
        <Router>
            <Header isLoggedIn={isLoggedIn} role={role} />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/profile"
                    element={isLoggedIn ? <Profile /> : <Navigate to="/login" />}
                />
                <Route
                    path="/volunteers"
                    element={isLoggedIn && role === 'ngo' ? <VolunteerList /> : <Navigate to="/login" />}
                />
                <Route
                    path="/ngos"
                    element={isLoggedIn && role === 'volunteer' ? <NGOList /> : <Navigate to="/login" />}
                />
                <Route
                    path="/admin"
                    element={isLoggedIn && role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    );
};

export default App;

