// Description: This is the main server file for an e-commerce application.
// It sets up an Express server, connects to a MongoDB database, and defines routes for products, users, and the shopping cart.
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cors = require('cors');
const path = require('path');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
// const cartRoutes = require('./routes/cartRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/cart', cartRoutes);

// Page Routes - Now using EJS instead of static HTML
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Home',
    featuredProducts: [] // You'll need to fetch these from your API or database
  });
});

app.get('/products', (req, res) => {
  res.render('products', {
    title: 'Products',
    products: [] // You'll need to fetch these from your API or database
  });
  
});

app.get('/product/:id', (req, res) => {
  // You'll need to fetch product details based on req.params.id
  res.render('product-detail', {
    title: 'Product Details',
    productId: req.params.id,
    product: {} // This should be populated with the specific product data
  });
});

app.get('/cart', (req, res) => {
  res.render('cart', {
    title: 'Shopping Cart',
    cartItems: [] // You'll need to fetch these from session or database
  });
});

app.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
    message: '' // For displaying login errors/success messages
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});