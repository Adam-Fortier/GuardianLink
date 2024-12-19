const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const { verifyToken } = require('./middlewares/auth'); 
const db = require('./db'); 

dotenv.config(); // Load environment var

const app = express();

// Middleware 
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Database connection pool setup for efficient database querying
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', 
    user: process.env.DB_USER || 'adam',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'guardianlink',
    connectionLimit: 10, // Limit the number of simultaneous connections
});

// Separate route modules for different functionalities
app.use('/auth', require('./routes/auth')); // Authentication routes
app.use('/admin', require('./routes/admin')); // Admin-only routes
app.use('/volunteers', require('./routes/volunteers')); // NGO-accessible volunteer routes
app.use('/ngos', require('./routes/ngos')); // Volunteer-accessible NGO routes

// This route allows authenticated users to get their own profile data
app.get('/profile', verifyToken, async (req, res) => {
    const userId = req.user.id;

    try {
        // Retrieve user data by their ID from the database
        const users = await db.getUserById(userId);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];
        // Send back user data in the response, making sure no sensitive information is included
        res.status(200).json({
            id: user.id,
            email: user.email,
            role: user.role,
            firstName: user.first_name,
            lastName: user.last_name,
            organizationName: user.organization_name || '',
            areasOfConcern: user.areas_of_concern || '',
            hoursAvailablePerWeek: user.hours_available_per_week || '',
        });
    } catch (err) {
        console.error('Error fetching user profile:', err);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Redirects to the home directory when the root URL is accessed
app.get('/', (req, res) => {
    res.redirect('/home');
});

// Home Page with Directory
app.get('/home', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>GuardianLink Backend Directory</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f9; }
                    h1 { color: #2f819c; }
                    ul { list-style-type: none; padding: 0; }
                    li { margin: 10px 0; }
                    a { text-decoration: none; color: #2f819c; font-weight: bold; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <h1>GuardianLink Directory</h1>
                <ul>
                    <li><a href="/home">/home</a> - This directory page</li>
                    <li><a href="/auth/register">/auth/register</a> - Register a new user</li>
                    <li><a href="/auth/login">/auth/login</a> - Login as a user</li>
                    <li><a href="/volunteers">/volunteers</a> - View volunteers (NGO only)</li>
                    <li><a href="/ngos">/ngos</a> - View NGOs (Volunteer only)</li>
                    <li><a href="/profile">/profile</a> - View user profile (Logged-in user only)</li>
                    <li><a href="/admin">/admin</a> - Admin dashboard (Admin only)</li>
                </ul>
            </body>
        </html>
    `);
});

//error message for any undefined route
app.use((req, res) => {
    res.status(404).json({ message: 'The requested resource was not found.' });
});

// Catch errors from all routes and handle them in one place
app.use((err, req, res, next) => {
    console.error('Unexpected error:', err);
    res.status(500).json({ message: 'An unexpected error occurred.' });
});

// Start the Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

