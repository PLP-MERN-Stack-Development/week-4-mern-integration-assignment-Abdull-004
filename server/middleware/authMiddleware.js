// server/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer TOKEN")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find user by ID from the decoded token and attach to request object
            // .select('-password') excludes the password field from the returned user object
            req.user = await User.findById(decoded.id).select('-password');

            // If user is not found, throw an error
            if (!req.user) {
                res.status(401); // Unauthorized
                throw new Error('Not authorized, user not found');
            }

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error(error);
            res.status(401); // Unauthorized
            throw new Error('Not authorized, token failed');
        }
    }

    // If no token is provided in the header
    if (!token) {
        res.status(401); // Unauthorized
        throw new Error('Not authorized, no token');
    }
});

module.exports = { protect };
