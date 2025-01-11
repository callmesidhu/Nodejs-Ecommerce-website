var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/User');

// Account page
router.get('/', function (req, res, next) {
    res.render('account'); // Pass a default value for messages
});

// Register route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('account', { message: 'Email is already registered.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.render('account', { message: 'Registration successful! Please log in.' });
    } catch (error) {
        console.error(error);
        res.render('account', { message: 'Server error. Please try again.' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.render('account', { message: 'No user found with that email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('account', { message: 'Incorrect password.' });
        }

        // If login is successful, redirect or render a success message
        res.redirect('/cart'); // Redirect to cart or dashboard after successful login
    } catch (error) {
        console.error(error);
        res.render('account', { message: 'Something went wrong. Please try again later.' });
    }
});

module.exports = router;
