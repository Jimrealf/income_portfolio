const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const incomeRoutes = require('./routes/incomeRoutes');
const userRoutes = require('./routes/userRoutes');
const swaggerSetup = require('./swagger');
require('dotenv').config();

const app = express();
swaggerSetup(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));

// Routes
app.use('/api/income', incomeRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).send('Sorry, that page does not exist.');
});

module.exports = app;
