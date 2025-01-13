const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Account page
router.get('/', (req, res) => {
    if (req.session.userlogin) {
        return res.redirect('/');
    }
    const warningMessage = req.session.warning;
    req.session.warning = null; // Clear warning message after reading
    res.render('account', { warningMessage });
});

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        req.session.warning = 'All fields are required!';
        return res.redirect('/account'); // Redirect to account page
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.session.warning = 'User already exists!';
            return res.redirect('/account');
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        req.session.warning = 'Registration successful! Please log in.';
        res.redirect('/account');
    } catch (error) {
        console.error(error);
        req.session.warning = 'Registration error!';
        res.redirect('/account');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        req.session.warning = 'Email and password are required!';
        return res.redirect('/account');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.warning = 'No user found!';
            return res.redirect('/account');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.session.warning = 'Invalid credentials!';
            return res.redirect('/account');
        }

        req.session.userlogin = true;
        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        req.session.warning = 'Login error!';
        res.redirect('/account');
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.redirect('/');
        }
        res.redirect('/account');
    });
});

module.exports = router;
