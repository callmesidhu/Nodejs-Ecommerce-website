var express = require('express');
var router = express.Router();
var Product = require('../models/Product');


router.get('/', async (req, res) => {
       let userDetails = req.session.user;
       const products = await Product.find().sort({ createdAt: -1 }); // -1 for descending order
       res.render('home', { products , userDetails });
       console.log(userDetails)
});
         

module.exports = router;
