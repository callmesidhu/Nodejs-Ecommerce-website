const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
   
    const uri = process.env.MONGO_URI; 
    
    await mongoose.connect(uri);  
    
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connectDB;
