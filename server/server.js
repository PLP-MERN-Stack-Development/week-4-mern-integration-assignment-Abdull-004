// server.js

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); // Mongoose is still needed for models, but connection is in db.js
const cors = require('cors');
const morgan = require('morgan'); // For logging HTTP requests
const connectDB = require('./config/db'); // Import the database connection function

// Import route files
const postRoutes = require('./routes/postRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/authRoutes'); // Authentication routes for users

// Import custom error handling middleware
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
// Enable CORS for all origins (you might want to restrict this in production)
app.use(cors());

// Body parser middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logger middleware (e.g., 'dev' for concise output)
app.use(morgan('dev'));

// Define API routes
// All requests to /api/posts will be handled by postRoutes
app.use('/api/posts', postRoutes);
// All requests to /api/categories will be handled by categoryRoutes
app.use('/api/categories', categoryRoutes);
// All requests to /api/auth will be handled by authRoutes for user authentication
app.use('/api/auth', authRoutes);

// Basic route for testing if the backend is online
app.get('/', (req, res) => {
    res.send('MERN Blog Backend API is online!');
});

// Custom 404 Not Found middleware
// This will catch any requests that don't match the above routes
app.use(notFound);

// Custom error handling middleware
// This should be the last middleware in your stack
app.use(errorHandler);

// Define the port the server will listen on
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});