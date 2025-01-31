var express = require('express');
var router = express.Router();
const Product = require('../models/Product');
const Cart = require('../models/Cart');



// Route to show the cart
router.get('/', async function (req, res) {
    try {
        const userDetails = req.session.user;
        const userStatus = req.session.userlogin;

        if (!userStatus) {
            return res.redirect('/account'); // Redirect if not logged in
        }

        const userId = userDetails.id;
        let cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.render('cart', { userDetails, cart: [], totalAmount: 0 }); // Render empty cart
        }

        // Map cart items with total price calculation
        const cartDisplay = cart.items.map(item => ({
            product: item.product,
            quantity: item.quantity,
            total: item.quantity * item.product.price, // Total price for the item
        }));

        // Calculate the total amount for all items
        const totalAmount = cartDisplay.reduce((sum, item) => sum + item.total, 0);

        return res.render('cart', { userDetails, cart: cartDisplay, totalAmount });
    } catch (err) {
        console.error('Error fetching cart:', err);
        res.status(500).send('Error fetching cart');
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
        // Redirect to the cart page 
        res.redirect('/cart');
    } catch (err) {
        console.error('Error saving cart:', err);
        res.status(500).send('Error saving cart');
    }
});

//remove cart products
router.post('/remove/:id', async (req, res) => {
    try {
        const userDetails = req.session.user;
        const userId = userDetails ? userDetails.id : null;

        if (!userId) {
            return res.redirect('/account'); // Redirect if user is not logged in
        }

        const productId = req.params.id; // Get the product ID from the URL

        // Fetch the user's cart
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).send('Cart not found');
        }

        // Filter out the item to be removed
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Save the updated cart
        await cart.save();

        console.log('Product removed successfully:', productId);
        res.redirect('/cart'); // Redirect back to the cart page after removal
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/quantity', async (req, res) => {
    // Extract productId and quantity from request body
    const { id: productId, quantity } = req.body;

    // Assuming you have user details stored in the session
    const userDetails = req.session.user;
    
    // Extract user ID from the session user details
    const userId = userDetails ? userDetails.id : null;
    console.log(userId, productId, quantity);
    try {
        // Find the user's cart document (Assuming it's stored in a "carts" collection)
        const cart = await Cart.findOne({ user: userId });

        // If no cart found, return a response
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Find the product in the cart's items array
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // If product found, update its quantity
            cart.items[itemIndex].quantity = quantity;
            await cart.save();  // Save the updated cart
            return res.status(200).json({ message: 'Cart updated successfully', cart });
        } else {
            // If product not found, respond with an error
            return res.status(404).json({ message: 'Product not found in cart' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});





module.exports = router;
