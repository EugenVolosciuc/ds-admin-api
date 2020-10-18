const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectToDB = require('./database/connect');

const app = express();
const PORT = process.env.port || 3001;

// Config
require('dotenv').config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: process.env.FRONTEND_DEV_LINK })); // TODO: add prod link when will launch product

connectToDB();

// Routes
app.use('/users', require('./routes/userRoutes'));
app.use('/schools', require('./routes/schoolRoutes'));

app.listen(PORT, console.log(`Server is running on ${process.env.NODE_ENV} on port ${PORT}`));