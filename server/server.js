const express = require('express');
const cors = require('cors');
const path = require('path');

// Load environment variables from .env file
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const connectDB = require('./config/db');

// Connect to MongoDB database
connectDB();

// Create Express application
const app = express();

// Enable CORS for frontend requests
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Define API routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/snippets', require('./routes/snippets'));

// Set up Swagger UI
require('./swagger')(app);

// Simple route to check if server is running
app.get('/', (req, res) => {
  res.json({ message: 'API Running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Server error' });
});

// Start server
const PORT = process.env.API_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
