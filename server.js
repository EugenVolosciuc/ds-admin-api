const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectToDB = require('./database/connect');
const { handleError } = require('./utils/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Config
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_DEV_LINK })); // TODO: add production link when will launch product

connectToDB();

// Instantiate cron jobs
require('./cron/init')();

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/schools', require('./routes/schoolRoutes'));
app.use('/vehicles', require('./routes/vehicleRoutes'));
app.use('/locations', require('./routes/locationRoutes'));
app.use('/lessons', require('./routes/lessonRoutes'));
app.use('/lesson-requests', require('./routes/lessonRequestRoutes'));
app.use('/cron', require('./routes/cronRoutes'));

// Error handling
app.use((err, req, res, next) => {
    handleError(err, res);
});

// Run server
app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} on port ${PORT}`));