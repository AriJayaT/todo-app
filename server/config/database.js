// server/config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB Atlas Connection
const connectMongoDB = async () => {
  try {
    // The MongoDB Atlas connection string from your .env file
    // Format: mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
    const mongoURI = process.env.MONGODB_URI;
    
    // Connect to MongoDB Atlas
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

module.exports = {
  connectMongoDB
};