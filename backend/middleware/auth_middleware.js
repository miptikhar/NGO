// Import dotenv to load environment variables
require('dotenv').config(); 

const jwt = require('jsonwebtoken'); 

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Get authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // No token, return 401
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => { // Use JWT_SECRET from .env
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' }); // Invalid token, return 401
        }
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authMiddleware;

