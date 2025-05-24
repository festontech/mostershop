const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const authRoutes = require('./routes/authRoutes');
const shopRoutes = require('./routes/shopRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method')); // For PUT and DELETE requests from forms


// Session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
  })
);


// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Make the current path available in all views
app.use((req, res, next) => {
  res.locals.path = req.path;

  next();
});


// Flash messages middleware
app.use((req, res, next) => {
  res.locals.success_msg = req.session.success_msg;
  res.locals.error_msg = req.session.error_msg;
  res.locals.user = req.session.user || null;
  res.locals.isAdmin = req.session.isAdmin || false;
  
  // Clear flash messages after displaying
  if (req.session.success_msg) delete req.session.success_msg;
  if (req.session.error_msg) delete req.session.error_msg;
  
  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);

// Home route
app.get('/', (req, res) => {
  res.redirect('/shop');
});

// 404 Route
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    status: 404,
    message: 'The page you are looking for does not exist.'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;