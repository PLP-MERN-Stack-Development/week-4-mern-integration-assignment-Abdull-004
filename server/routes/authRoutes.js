// server/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Import the protection middleware

// Public routes for user registration and login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Private route to get user profile, protected by 'protect' middleware
router.get('/me', protect, getMe);

module.exports = router;
