CREATE DATABASE guardianlink;

USE guardianlink;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),
    role ENUM('admin', 'ngo', 'volunteer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ngos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    organization_name VARCHAR(255),
    poc_email VARCHAR(255),
    areas_of_concern TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE volunteers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    availability_hours INT,
    criminal_background_check BOOLEAN,
    resume TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
