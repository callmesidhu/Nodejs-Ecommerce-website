var express = require('express');
var router = express.Router();
const Product = require('../models/Product'); 



router.post('/add', async function(req, res) {
    try {
        const { title, image, description, price } = req.body;

        // Simple validation
        if (!title || !image || !description || !price) {
            return res.status(400).send('All fields are required'); // Check for required fields
        }

        // Create a new product instance
        const newProduct = new Product({
            title,
            image,
            description,
            price: parseFloat(price), // Ensure price is a number
        });

        // Save the product to the database
        await newProduct.save();

        console.log('Product added successfully:', newProduct.id);

        // Redirect back to the admin page or show a success message
        res.redirect('/admin');
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).send('Server error'); // Handle any errors
    }
});





router.get('/', async (req, res) => {

});


module.exports = router; 
