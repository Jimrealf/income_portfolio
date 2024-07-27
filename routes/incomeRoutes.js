const express = require('express');
const {
    getAllIncome,
    getIncome,
    deleteIncome,
    addIncome,
    updateIncome,
} = require('../controllers/incomeController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { validateIncome } = require('../middleware/validation');

const router = express.Router();

// Get all incomes by a user
router.get('/', authenticateToken, getAllIncome);

//  Get a single income by a user
router.get('/:id', authenticateToken, getIncome);

//  Delete a single income by a user
router.delete('/:id', authenticateToken, deleteIncome);

// Add a single income by a user
router.post('/', authenticateToken, validateIncome, addIncome);

// Update a single income by a user
router.put('/:id', authenticateToken, validateIncome, updateIncome);

module.exports = router;
