const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGODB_URI;

// Connect to the mongoDB
const connectDB = async() => {
    await mongoose.connect(URI);
    console.log('Database connected')
};

module.exports = connectDB;
