// hashPassword.js
const bcrypt = require('bcryptjs');

// Generate hashed password using bcrypt with salt rounds
const generateHash = async (password) => {
    try {
        const saltRounds = 10; // Set salt rounds for hashing complexity
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log('Generated Hash:', hashedPassword);
    } catch (error) {
        console.error('Error generating hash:', error);
    }
};

// Replace 'password123' with the desired plaintext password for hashing
generateHash('password123');
