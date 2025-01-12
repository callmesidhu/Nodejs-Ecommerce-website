const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Account page
router.get('/', (req, res) => {
    if (req.session.userlogin) {
        return res.redirect('/');
    }
    const warningMessage = req.query.message || null;
    res.render('account', { warningMessage });
});

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.render( { warningMessage: 'All fields are required!' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render({ warningMessage: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.render({ warningMessage: 'Registration successful! Please log in' });
    } catch (error) {
        console.error(error);
        res.render( { warningMessage: 'Registration error!' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.render({ warningMessage: 'Email and password are required!' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render( { warningMessage: 'No user found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render( { warningMessage: 'Invalid credentials' });
        }

        req.session.userlogin = true;
        req.session.user = { id: user._id, username: user.username, email: user.email };
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.render({ warningMessage: 'Login error!' });
    }
});

// Logout route
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
