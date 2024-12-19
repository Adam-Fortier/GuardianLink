const mysql = require('mysql2');

// Connection pool for better performance and reliability
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'adam',
    password: process.env.DB_PASSWORD || 'password123',
    database: process.env.DB_NAME || 'guardianlink',
    connectionLimit: 10,
});

// Function to execute queries using the connection pool
const executeQuery = (query, values) => {
    return new Promise((resolve, reject) => {
        console.log('Executing query:', query);
        pool.query(query, values, (err, results) => {
            if (err) {
                console.error('Database query error:', err.message);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Database operations
const db = {
    // Insert user into the users table
    insertUser: (userData) => {
        const {
            firstName,
            lastName,
            email,
            hashedPassword,
            role,
            organizationName,
            areasOfConcern,
            hoursAvailablePerWeek,
            criminalBackgroundCheck,
            resume,
        } = userData;

        let query;
        let values;

        if (role === 'ngo') {
            query = `
                INSERT INTO users 
                (first_name, last_name, email, password, role, organization_name, areas_of_concern) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            values = [firstName, lastName, email, hashedPassword, role, organizationName, areasOfConcern];
        } else if (role === 'volunteer') {
            query = `
                INSERT INTO users 
                (first_name, last_name, email, password, role, hours_available_per_week, criminal_background_check, resume) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            values = [firstName, lastName, email, hashedPassword, role, hoursAvailablePerWeek, criminalBackgroundCheck, resume];
        } else {
            return Promise.reject(new Error('Invalid role specified.'));
        }

        return executeQuery(query, values);
    },

    // Get user by email address
    getUserByEmail: (email) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        return executeQuery(query, [email]);
    },

    // Get user by ID
    getUserById: (id) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        return executeQuery(query, [id]);
    },

    // Get all users (Admin only)
    getAllUsers: () => {
        const query = 'SELECT id, first_name, last_name, email, role FROM users';
        return executeQuery(query);
    },

    // Update user role (Admin only)
    updateUserRole: (id, role) => {
        const query = 'UPDATE users SET role = ? WHERE id = ?';
        return executeQuery(query, [role, id]);
    },

    // Delete user by ID
    deleteUserById: (id) => {
        const query = 'DELETE FROM users WHERE id = ?';
        return executeQuery(query, [id]);
    },

    // Get volunteers (for NGOs)
    getVolunteers: () => {
        const query = `
            SELECT id, first_name, last_name, email, hours_available_per_week, criminal_background_check, resume 
            FROM users 
            WHERE role = "volunteer"
        `;
        return executeQuery(query);
    },

    // Get NGOs (for Volunteers)
    getNGOs: () => {
        const query = `
            SELECT 
                id, 
                organization_name AS organizationName, 
                email, 
                areas_of_concern AS areasOfConcern,
                first_name AS firstName, 
                last_name AS lastName
            FROM users 
            WHERE role = "ngo"
        `;
        return executeQuery(query);
    },

    // Update user profile
    updateUserProfile: (id, updatedFields) => {
        const fieldMapping = {
            firstName: 'first_name',
            lastName: 'last_name',
            email: 'email',
            password: 'password',
            organizationName: 'organization_name',
            areasOfConcern: 'areas_of_concern',
            hoursAvailablePerWeek: 'hours_available_per_week',
            criminalBackgroundCheck: 'criminal_background_check',
            resume: 'resume',
        };

        const mappedFields = {};
        for (const [key, value] of Object.entries(updatedFields)) {
            const mappedKey = fieldMapping[key] || key; // Use mapped key or default to the original key
            mappedFields[mappedKey] = value;
        }

        const query = 'UPDATE users SET ? WHERE id = ?';
        return executeQuery(query, [mappedFields, id]);
    },

    // Update user password
    updateUserPassword: (id, hashedPassword) => {
        const query = 'UPDATE users SET password = ? WHERE id = ?';
        return executeQuery(query, [hashedPassword, id]);
    },

    // Save password reset token
    savePasswordResetToken: (email, token, expiration) => {
        const query = 'UPDATE users SET reset_token = ?, reset_token_expiration = ? WHERE email = ?';
        return executeQuery(query, [token, expiration, email]);
    },

    // Get user by reset token
    getUserByResetToken: (token) => {
        const query = 'SELECT * FROM users WHERE reset_token = ? AND reset_token_expiration > NOW()';
        return executeQuery(query, [token]);
    },

    // Clear reset token after password reset
    clearResetToken: (token) => {
        const query = 'UPDATE users SET reset_token = NULL, reset_token_expiration = NULL WHERE reset_token = ?';
        return executeQuery(query, [token]);
    },
};

module.exports = db;
