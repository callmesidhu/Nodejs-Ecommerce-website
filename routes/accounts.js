var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const { body, validationResult } = require('express-validator'); 


router.get('/', function(req, res, next) {
       res.render('account');
       });          

router.post('/login', function(req, res, next) {});

// Register route
router.post(
       '/register',
       [
         body('username').notEmpty().withMessage('Username is required'),
         body('email').isEmail().withMessage('Invalid email format'),
         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
       ],
       async (req, res, next) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
           return res.status(400).json({ errors: errors.array() });
         }
     
         const { username, email, password } = req.body;
     
         try {
           // Check if the user already exists
           const existingUser = users.find(user => user.email === email);
           if (existingUser) {
             return res.status(400).json({ message: 'Email is already registered' });
           }
     
           // Hash the password
           const hashedPassword = await bcrypt.hash(password, 10);
     
           // Save the user
           const newUser = { username, email, password: hashedPassword };
           users.push(newUser); // Replace with database insertion logic
     
           res.status(201).json({ message: 'User registered successfully' });
         } catch (error) {
           next(error); // Pass error to error-handling middleware
         }
       }
     );

module.exports = router;
