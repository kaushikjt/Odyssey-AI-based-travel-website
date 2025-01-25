const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Sign up route
router.get('/signup', (req, res) => res.render('signup'));

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        // Redirect to login page after successful signup
        res.redirect('/login');
    } catch (error) {
        res.status(500).json({ success: false, message: 'Signup failed.' });
    }
});

// Login route
router.get('/login', (req, res) => res.render('login'));

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        req.session.user = user;
        // Redirect to home page after successful login
        return res.redirect('/home');  // This ensures the redirect occurs
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed.' });
    }
});


// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.clearCookie('connect.sid');
        // Redirect to login page after logout
        res.redirect('/login');
    });
});

module.exports = router;
