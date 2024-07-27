const { body, validationResult } = require('express-validator');

validateIncome = [
    body('source').notEmpty().withMessage('Source is required'),
    body('amount')
        .isFloat({ gt: 0 })
        .withMessage('Amount must be greater than zero'),
    body('date').isISO8601().withMessage('Date must be a valid date'),
    body('category').notEmpty().withMessage('Category is required'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

module.exports = { validateIncome };
