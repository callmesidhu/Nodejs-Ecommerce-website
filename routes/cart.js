var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const User = require('../models/User');

// Route to show the cart
router.get('/', async function(req, res, next) {
    let userDetails = req.session.user;
    let userStatus = req.session.userlogin;

    // Ensure user is logged in
    if (userStatus) {
        const userId = userDetails.id; // Extract userId from session
        let cart = await Cart.findOne({ user: userId }).populate('items.product');
        
        // Check if cart is empty or doesn't exist
        if (!cart || cart.items.length === 0) {
            return res.render('cart', { userDetails, cart: [] }); // Empty cart
        } else {
            return res.render('cart', { userDetails, cart: cart.items }); // Render cart with products
        }
    } else {
        res.redirect('/account'); // Redirect if not logged in
    }
});

// Add product to cart
router.get('/add/:id', async (req, res) => {
    const userDetails = req.session.user;
    const userStatus = req.session.userlogin;
    const userId = userStatus ? userDetails.id : null;
    console.log('User ID:', userId); // Log userId to check if it's correctly retrieved
    
    if (!userId) {
        return res.redirect('/account'); // Redirect if no user is logged in
    }

    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send('Product not found');
    }

    // Fetch the user's cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        // Create a new cart if none exists
        cart = new Cart({ user: userId, items: [] });
    }

    // Check if product already exists in the cart
    const existingProduct = cart.items.find(item => item.product.toString() === productId);
    if (existingProduct) {
        // If product exists, increase quantity by 1
        existingProduct.quantity += 1;
    } else {
        // If product doesn't exist, add it to the cart
        cart.items.push({ product: productId, quantity: 1 });
    }

    try {
        // Save the cart
        await cart.save();
        // Redirect to the cart page with success message
        res.redirect('/cart?added=true');
    } catch (err) {
        console.error('Error saving cart:', err);
        res.status(500).send('Error saving cart');
    }
});

module.exports = router;
