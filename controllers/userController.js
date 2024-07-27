const { query } = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
            [username, hashedPassword, email]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Authenticate user
authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await query('SELECT * FROM users WHERE email = $1', [
            email,
        ]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'User not found' });

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res
                .status(400)
                .json({ message: 'Incorrect email/password' });
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get user profile
getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await query('SELECT * FROM users WHERE id = $1', [
            userId,
        ]);
        if (result.rows.length === 0)
            return res.status(404).json({ message: 'User not found' });
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    registerUser,
    authenticateUser,
    getUserProfile,
};
