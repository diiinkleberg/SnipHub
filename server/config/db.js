const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 *
 * @returns {Promise<mongoose.Connection>} Mongoose connection object
 */
const connectDB = async () => {
  try {
    // Get database connection string from .env
    const dbUrl = process.env.MONGO_URI;

    if (!dbUrl) {
      throw new Error('Missing MONGO_URI in environment variables');
    }

    // Configure Mongoose options for better stability
    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Connect to MongoDB
    const conn = await mongoose.connect(dbUrl, options);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Return connection
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Add event listeners for connection issues
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected successfully');
});

module.exports = connectDB;
