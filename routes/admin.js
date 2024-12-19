const express = require('express');
const bcrypt = require('bcryptjs');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const db = require('../db');

const router = express.Router();

// Get All Users (Admin Only)
router.get('/users', verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await db.getAllUsers();
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Add User (Admin Only)
router.post('/add-user', verifyToken, isAdmin, async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;

    // Ensure required fields are present
    if (!email || !password || !role || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required fields.' });
    }

    try {
        // Hash the user's password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.insertUser({
            firstName,
            lastName,
            email,
            hashedPassword,
            role,
            organizationName: role === 'ngo' ? req.body.organizationName : null,
            pocEmail: role === 'ngo' ? req.body.pocEmail : null,
            areasOfConcern: role === 'ngo' ? req.body.areasOfConcern : null,
            hoursAvailablePerWeek: role === 'volunteer' ? req.body.hoursAvailablePerWeek : null,
            criminalBackgroundCheck: null,
            resume: null,
        });

        res.status(201).json({ message: 'User profile created successfully!' });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error adding user.' });
    }
});

// Delete User (Admin Only)
router.delete('/users/:id', verifyToken, isAdmin, async (req, res) => {
    const userId = req.params.id;
    try {
        await db.deleteUserById(userId);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Error deleting user' });
    }
});

module.exports = router;

