const express = require('express');
const { verifyToken } = require('../middlewares/auth'); // Middleware for token verification
const db = require('../db');

const router = express.Router();

// Update user profile
router.patch('/', verifyToken, async (req, res) => {
    try {
        const { id, ...updatedFields } = req.body;

        if (!id || !Object.keys(updatedFields).length) {
            return res.status(400).json({ message: 'Invalid data provided.' });
        }

        // Update user profile in the database
        const result = await db.updateUserProfile(id, updatedFields);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (err) {
        console.error('Error updating profile:', err.message);
        res.status(500).json({ message: 'Failed to update profile.' });
    }
});

module.exports = router;
