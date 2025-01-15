const mongoose = require('mongoose');
const Product = require('./Product');  
const User = require('./User')

// Cart Schema
const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuaming you have a User model
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

// Cart Model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
