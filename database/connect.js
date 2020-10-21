const mongoose = require('mongoose');
const { ErrorHandler } = require('../utils/errorHandler');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true });
        console.log("Connection to DB successful!");
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

module.exports = connectToDB;