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

/**
 * @swagger
 * /api/income:
 *   get:
 *     summary: Get all income entries
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all income entries
 *       500:
 *         description: Server error
 */

// Get all incomes by a user
router.get('/', authenticateToken, getAllIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   get:
 *     summary: Get a single income entry
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The income ID
 *     responses:
 *       200:
 *         description: Income entry fetched successfully
 *       404:
 *         description: Income entry not found
 *       500:
 *         description: Server error
 */

//  Get a single income by a user
router.get('/:id', authenticateToken, getIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   delete:
 *     summary: Delete an income entry
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The income ID
 *     responses:
 *       200:
 *         description: Income entry deleted successfully
 *       404:
 *         description: Income entry not found
 *       500:
 *         description: Server error
 */

//  Delete a single income by a user
router.delete('/:id', authenticateToken, deleteIncome);

/**
 * @swagger
 * /api/income:
 *   post:
 *     summary: Add a new income entry
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source
 *               - amount
 *               - date
 *               - category
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Income entry added successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Server error
 */

// Add a single income by a user
router.post('/', authenticateToken, validateIncome, addIncome);

/**
 * @swagger
 * /api/income/{id}:
 *   put:
 *     summary: Update an existing income entry
 *     tags: [Income]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The income ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - source
 *               - amount
 *               - date
 *               - category
 *             properties:
 *               source:
 *                 type: string
 *               amount:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Income entry updated successfully
 *       404:
 *         description: Income entry not found
 *       500:
 *         description: Server error
 */

// Update a single income by a user
router.put('/:id', authenticateToken, validateIncome, updateIncome);

module.exports = router;
