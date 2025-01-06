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

// POST route to delete a product
router.post('/delete/:id', isAdmin, async (req, res) => {
        try {
          const { id } = req.params; // Get the product ID from the URL
      
          // Find and delete the product by ID
          const deletedProduct = await Product.findByIdAndDelete(id);
      
          if (!deletedProduct) {
            return res.status(404).send('Product not found');
          }
      
          console.log('Product deleted successfully:', deletedProduct);
          res.redirect('/admin'); // Redirect back to the admin page after deletion
        } catch (error) {
          console.error('Error deleting product:', error);
          res.status(500).send('Internal Server Error');
        }
      });

module.exports = router;
