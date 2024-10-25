  const jwt = require('jsonwebtoken');
  const User = require('../models/userModel');

  // Helper function to verify token
  const verifyToken = async (token) => {
    try {
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.jwt_secret);

      // Find the user by ID, excluding password
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error) {
      throw error;
    }
  };

  // Protect middleware for protected routes
  const protect = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
      req.user = await verifyToken(token);
      next();
    } catch (error) {
      console.error('Token verification failed:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Not authorized, token invalid' });
      } else {
        return res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }
  };

  // isLogin middleware to check login status
  const isLogin = async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not logged in, no token' });
    }

    try {
      const user = await verifyToken(token);
      return res.status(200).json({ success: true, message: 'User is logged in', user });
    } catch (error) {
      console.error('Token verification failed:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Token invalid' });
      } else {
        return res.status(401).json({ success: false, message: 'Token verification failed' });
      }
    }
  };

  module.exports = { protect, isLogin };
