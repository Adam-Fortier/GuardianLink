const express = require('express');
const { verifyToken, isNGO } = require('../middlewares/auth');
const db = require('../db');

const router = express.Router();

// Get Volunteers (accessible by NGOs only)
router.get('/', verifyToken, isNGO, async (req, res) => {
    try {
        // Fetch volunteers from the database
        const volunteers = await db.getVolunteers();

        if (volunteers.length === 0) {
            return res.status(404).json({ message: 'No Volunteers available.' });
        }

        res.status(200).json(volunteers);
    } catch (err) {
        console.error('Error fetching Volunteers:', err);
        res.status(500).json({ message: 'Error fetching Volunteers' });
    }
});

module.exports = router;
