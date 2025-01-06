var express = require('express');
var router = express.Router();
const Product = require('../models/Product'); 



router.post('/add', async function(req, res) {
});


router.get('/', async (req, res) => {
        res.render('admin');
});


module.exports = router; 
