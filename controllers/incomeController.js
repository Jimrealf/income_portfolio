const { query } = require('../models/db');

// Get all incomes by a user
getAllIncome = async (req, res) => {
    try {
        const result = await query('SELECT * FROM income WHERE user_id = $1', [
            req.user.id,
        ]);
        return res.json(result.rows);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//  Get a single income by a user
getIncome = async (req, res) => {
    try {
        const result = await query(
            'SELECT * FROM income WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        if (result.rows.length === 0)
            return res
                .status(404)
                .json({ message: 'The requested income does not exist' });
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//  Delete a single income by a user
deleteIncome = async (req, res) => {
    try {
        const result = await query(
            'DELETE FROM income WHERE id = $1 AND user_id = $2',
            [req.params.id, req.user.id]
        );
        if (result.rowCount === 0)
            return res
                .status(404)
                .json({ message: 'The requested income does not exist' });
        return res.json({ message: 'Income deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Add a single income by a user
addIncome = async (req, res) => {
    try {
        const { source, amount, date, category } = req.body;
        if (!source || !amount || !date || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        const result = await query(
            'INSERT INTO income (user_id, source, amount, date, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, source, amount, date, category]
        );
        return res.status(201).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Update a single income by a user
updateIncome = async (req, res) => {
    try {
        const { source, amount, date, category } = req.body;
        const result = await query(
            'UPDATE income SET source = $1, amount = $2, date = $3, category = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
            [source, amount, date, category, req.params.id, req.user.id]
        );
        if (result.rows.length === 0)
            return res
                .status(404)
                .json({ message: 'The requested income does not exist' });
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllIncome,
    getIncome,
    deleteIncome,
    addIncome,
    updateIncome,
};
