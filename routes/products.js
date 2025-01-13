var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
        let userDetails = req.session.user;
        let userStatus = req.session.userlogin;
       res.render('products');
       }); 
       
router.get('/details', function(req, res, next) {
        let userDetails = req.session.user;
        let userStatus = req.session.userlogin;
        res.render('productDetails');
        });  

module.exports = router;
