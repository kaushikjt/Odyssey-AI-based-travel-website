const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Handle user login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Store user in session
        req.session.user = user;

        // Successful login, redirect to home page or send a success message
        return res.redirect('/home');  // Server-side redirection
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
