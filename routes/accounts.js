var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const User = require('../models/User');
const { response } = require('../app');

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
            console.log('User already exists');
        }else{

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        console.log('Registration successful! Please log in');
        res.redirect('/account');
    }
    } catch (error) {
        console.error(error);
        console.log('Registration error!');
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('No user found');
        }else{
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                console.log('Invalid credentials');
            }else{
                req.session.userlogin=true;
                req.session.user = { id: user._id, username: user.username, email: user.email };
                res.redirect('/');
            }
        }

    } catch (error) {
        console.error(error);
        console.log('Login error!');
    }
});

module.exports = router;
