var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt'); 
const { body, validationResult } = require('express-validator'); 


router.get('/', function(req, res, next) {
       res.render('account');
       });    
             
  router.post('/register', async (req, res) => {
        const { username, email, password } = req.body;
      
        console.log(req.body);
      });
      
      // Login route
router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        console.log(req.body);
      });
      

module.exports = router;
