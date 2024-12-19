const express = require('express');
const { verifyToken, isVolunteer } = require('../middlewares/auth'); // Middleware for role-based access
const db = require('../db');

const router = express.Router();

// Get NGOs (accessible by volunteers only)
router.get('/', verifyToken, isVolunteer, async (req, res) => {
    try {
        // Fetch NGOs from the database
        const ngos = await db.getNGOs();

        if (!ngos || ngos.length === 0) {
            return res.status(404).json({ message: 'No NGOs available.' });
        }

        console.log('NGOs retrieved:', ngos); // Debug log
        res.status(200).json(ngos);
    } catch (err) {
        console.error('Error fetching NGOs:', err);
        res.status(500).json({ message: 'Error fetching NGOs.' });
    }
});

module.exports = router;
