const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
const multer = require('multer'); // Import multer for file uploads
const { verifyToken, isAdmin } = require('../middlewares/auth'); // Import middlewares
const router = express.Router();

// Initialize multer for file upload handling
const upload = multer({
    limits: { fileSize: 10 * 1024 * 1024 } // Set file size limit to 10MB
});

// Register User (with optional uploads for volunteers)
router.post('/register', upload.fields([
    { name: 'criminalBackgroundCheck', maxCount: 1 },
    { name: 'resume', maxCount: 1 }
]), async (req, res) => {
    const { email, password, role, firstName, lastName, organizationName, areasOfConcern, hoursAvailablePerWeek } = req.body;

    try {
        // Validate incoming data
        if (!email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare user data for database insertion
        const userData = {
            firstName,
            lastName,
            email,
            hashedPassword,
            role,
            organizationName: role === 'ngo' ? organizationName : null,
            areasOfConcern: role === 'ngo' ? areasOfConcern : null,
            hoursAvailablePerWeek: role === 'volunteer' ? hoursAvailablePerWeek : null,
            criminalBackgroundCheck: role === 'volunteer' && req.files?.criminalBackgroundCheck ? req.files.criminalBackgroundCheck[0].buffer : null,
            resume: role === 'volunteer' && req.files?.resume ? req.files.resume[0].buffer : null,
        };

        // Insert user into the database
        await db.insertUser(userData);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error('Error during registration:', err.message);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Get user details by email
        const users = await db.getUserByEmail(email);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Send token and user details as a response
        res.status(200).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                firstName: user.first_name,
                lastName: user.last_name,
                organizationName: user.organization_name,
                areasOfConcern: user.areas_of_concern,
                hoursAvailablePerWeek: user.hours_available_per_week,
            },
        });
    } catch (err) {
        console.error('Error during login:', err.message);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get User Profile (requires authentication)
router.get('/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch user details by ID
        const users = await db.getUserById(userId);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = users[0];

        // Return user details
        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            organizationName: user.organization_name,
            areasOfConcern: user.areas_of_concern,
            hoursAvailablePerWeek: user.hours_available_per_week,
        });
    } catch (err) {
        console.error('Error fetching profile:', err.message);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Update User Profile (requires authentication)
router.patch('/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, email, organizationName, areasOfConcern, hoursAvailablePerWeek } = req.body;

    try {
        // Prepare user data for updating
        const userData = {
            firstName,
            lastName,
            email,
            organizationName,
            areasOfConcern,
            hoursAvailablePerWeek,
        };

        // Update user profile in the database
        await db.updateUserProfile(userId, userData);
        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

// Forgot Password (initiates password reset process)
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        // Get user details by email
        const users = await db.getUserByEmail(email);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate a secure reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');

        // Save reset token and its expiration in the database
        await db.savePasswordResetToken(email, resetToken, resetTokenExpires);

        // Send email logic would go here (using a service like nodemailer or any transactional email provider)

        res.status(200).json({ message: 'Password reset link sent' });
    } catch (err) {
        console.error('Error during password reset request:', err.message);
        res.status(500).json({ message: 'Error processing password reset' });
    }
});

// Reset Password (completes the password reset process)
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Get user by reset token
        const users = await db.getUserByResetToken(token);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user password in the database
        await db.updateUserPassword(users[0].id, hashedPassword);
        await db.clearResetToken(token);

        res.status(200).json({ message: 'Password reset successfully!' });
    } catch (err) {
        console.error('Error during password reset:', err.message);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

// Admin: Create User Profile (admin-only route)
router.post('/admin/add-user', verifyToken, isAdmin, async (req, res) => {
    const { email, password, role, firstName, lastName } = req.body;

    try {
        if (!email || !password || !role || !firstName || !lastName) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Prepare new user data
        const userData = {
            firstName,
            lastName,
            email,
            hashedPassword,
            role,
        };

        // Insert new user into the database
        await db.insertUser(userData);
        res.status(201).json({ message: 'User profile created successfully!' });
    } catch (err) {
        console.error('Error creating user profile:', err.message);
        res.status(500).json({ message: 'Error creating user profile' });
    }
});

// Delete User Profile (allows a logged-in user to delete their profile)
router.delete('/delete-profile', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Delete user profile from the database
        await db.deleteUserById(userId);
        res.status(200).json({ message: 'User profile deleted successfully' });
    } catch (err) {
        console.error('Error deleting user profile:', err.message);
        res.status(500).json({ message: 'Error deleting user profile' });
    }
});

module.exports = router;
