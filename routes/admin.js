var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product'); 
const User = require('../models/User')

// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
  try {
    const userDetails = req.session.user;
    const userId = userDetails.id;
    if (!userId) {
      return res.status(401).send('Unauthorized. Please log in.');
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    // Check if the user has admin privileges
    if (user.admin === true) {
      return next(); // Allow access
    }

    res.status(403).send('Access denied. Admin only.');
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).send('Internal Server Error');
  }
};

router.get('/', isAdmin, async (req, res) => {
        const products = await Product.find().sort({ createdAt: -1 }); // -1 for descending order
        res.render('admin', { products });
});



// POST route to add a product
router.post('/add', isAdmin, async (req, res) => {
        try {
          const { title, description, price } = req.body;
      
          // Save product details to the database
          const newProduct = new Product({
            title,
            description,
            price,
          });
          const savedProduct = await newProduct.save();
      
          console.log('Product added successfully:', savedProduct);
      
          // Check if an image is uploaded
          if (req.files && req.files.image) {
            const image = req.files.image;
      
            // Ensure storage directory exists
            const storagePath = path.resolve(__dirname, '../public/storage');
            if (!fs.existsSync(storagePath)) {
              fs.mkdirSync(storagePath, { recursive: true });
            }
      
            // Define the file path with the product ID as the file name
            const productId = savedProduct._id.toString();
            const filePath = path.join(storagePath, `${productId}${path.extname(image.name)}`);
      
            // Move the uploaded image to the storage folder
            image.mv(filePath, (error) => {
              if (error) {
                console.error('Error saving image:', error);
                return res.status(500).json({ message: 'Failed to save image' });
              }
      
              console.log('Image saved successfully:', filePath);
            });
          } else {
            console.warn('No image uploaded for this product.');
          }
      
          res.redirect('/admin');
        } catch (error) {
          console.error('Error adding product:', error);
          res.redirect('/admin');
        }
      });

// POST route to delete a product
router.post('/delete/:id', isAdmin, async (req, res) => {
        try {
          const { id } = req.params; // Get the product ID from the URL

          const imagePath = path.resolve(__dirname, '../public/storage', `${id}.jpg`);
         fs.unlink(imagePath, (err) => {
         if (err) console.error(`Error deleting image: ${err.message}`);
         });


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
