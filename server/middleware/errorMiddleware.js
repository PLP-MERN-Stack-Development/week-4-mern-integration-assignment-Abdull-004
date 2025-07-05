// server/middleware/errorMiddleware.js

// Middleware to handle 404 Not Found errors
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set status to 404
    next(error); // Pass the error to the next middleware (errorHandler)
};

// General error handling middleware
const errorHandler = (err, req, res, next) => {
    // Determine the status code: if it's a 200 (OK), change to 500 (Internal Server Error)
    // Otherwise, use the status code already set on the response
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode); // Set the response status code

    // Send a JSON response with the error message
    res.json({
        message: err.message, // The error message
        // In development, include the stack trace for debugging; in production, hide it
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {
    notFound,
    errorHandler,
};