const mongoose = require('mongoose');

const connectDB = async () => {
  try {
   
    const uri = 'mongodb://localhost:27017/redstore_db'; 
    
    await mongoose.connect(uri);  
    
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the application if the connection fails
  }
};

module.exports = connectDB;
