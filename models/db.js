const pool = require('../config/database');

const query = async (text, params) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (err) {
        throw err;
    }
};

module.exports = { query, pool };
