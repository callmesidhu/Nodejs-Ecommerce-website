var express = require('express');
var router = express.Router();
const Product = require('../models/Product'); // Ensure this points to your Product model

const admin = 'true'; // You should replace this with actual authentication logic
const isAdmin = (req, res, next) => {
  if (admin === 'true') { 
    return next(); 
  }
  res.status(403).send('Access denied. Admin only.'); 
};

router.get('/', isAdmin, async (req, res) => {
        const products = await Product.find().sort({ createdAt: -1 }); // -1 for descending order
        res.render('admin', { products });
});



// POST route to add a product
router.post('/add', isAdmin, async (req, res) => {
        try {
          const { title, description, price } = req.body;
      
          const newProduct = new Product({
            title,
            description,
            price,
          });
      
          const savedProduct = await newProduct.save();
      
          console.log('Product added successfully:', savedProduct);
          res.redirect('/admin')
        } catch (error) {
          console.error('Error adding product:', error);
          res.redirect('/admin')
        }
});

module.exports = router;
