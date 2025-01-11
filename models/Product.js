const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Make sure the title is required
      trim: true, // Removes leading and trailing whitespace
    },
    description: {
      type: String,
      required: true, // Description is also required
      trim: true, // Removes leading and trailing whitespace
    },
    price: {
      type: Number,
      required: true, // Price must be provided
      min: 0, // Price cannot be negative
    },
    createdAt: {
      type: Date,
      default: Date.now, // Set current date if not provided
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
