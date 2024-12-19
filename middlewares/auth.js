// jwt.js
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access Denied' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = user; // Add user data to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

// Middleware to check if user is an NGO
const isNGO = (req, res, next) => {
    if (req.user.role !== 'ngo') {
        return res.status(403).json({ message: 'NGO access required' });
    }
    next();
};

// Middleware to check if user is a volunteer
const isVolunteer = (req, res, next) => {
    if (req.user.role !== 'volunteer') {
        return res.status(403).json({ message: 'Volunteer access required' });
    }
    next();
};

module.exports = { verifyToken, isAdmin, isNGO, isVolunteer };
