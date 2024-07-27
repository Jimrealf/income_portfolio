const express = require('express');
const {
    registerUser,
    authenticateUser,
    getUserProfile,
} = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Authenticate user
router.post('/login', authenticateUser);

// Get user profile
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
