var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
       let userDetails = req.session.user;
       let userStatus = req.session.userlogin;
       if (userStatus) {
              res.render('cart', { userDetails });
          }else{
              res.redirect('/account')
          }
       
       });          

module.exports = router;
