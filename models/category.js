// models/Category.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  
  _id: String,
  // Using String for _id to allow for custom IDs like 'electronics', 'clothing', etc.
  name: {
    type: String,
    required: true,
    trim: true
  },
  parent: {
    type: String,
    ref: 'Category',
    default: null // null = top-level category
  }
});

module.exports = mongoose.model('Category', CategorySchema);
