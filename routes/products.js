var express = require('express');
const Product = require('../models/Product');
var router = express.Router();


router.get('/', async function(req, res, next) {
        let userDetails = req.session.user;
       let userStatus = req.session.userlogin;
       const products = await Product.find().sort({ createdAt: -1 }); // -1 for descending order
       
       res.render('products', { products , userDetails , userStatus });
       }); 
       
router.get('/details', function(req, res, next) {
        let userDetails = req.session.user;
        let userStatus = req.session.userlogin;
        res.render('productDetails');
        });  

module.exports = router;
