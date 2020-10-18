const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true });
        console.log("Connection to DB successful!");
    } catch (error) {
        console.error('Connection to DB unsuccessful', error);
    }
}

module.exports = connectToDB;