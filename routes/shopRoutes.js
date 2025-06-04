const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const cartController = require('../controllers/cartController');
const { isAuth } = require('../middleware/auth');
const initializeCart = require('../middleware/cart');

// Product routes
router.get('/', productController.getAllHomeProducts);
router.get('/shop', productController.getProductsPage);
router.get('/shop/product/:id', productController.getProductById);
// Api routes for products
// Get categories for navigation (AJAX)
router.get('/api/categories', productController.getCategoriesAPI);
// Get product suggestions for search autocomplete (AJAX)
router.get('/api/suggestions', productController.getProductSuggestionsAPI);
// Get category tree with product counts (AJAX)
router.get('/api/category-tree', productController.getCategoryTreeAPI);

// Cart routes
router.use('/cart', initializeCart);
router.get('/cart', cartController.getCart);
router.post('/cart/add/:id', cartController.addToCart);
router.post('/cart/update/:id', cartController.updateCartItem);
router.post('/cart/remove/:id', cartController.removeFromCart);
// API: Get cart count (for header)
router.get('/cart/count', cartController.getCartCount);
// Order routes (protected)
router.get('/orders', isAuth, orderController.getUserOrders);
router.get('/orders/:id', isAuth, orderController.getOrderById);
router.get('/checkout', isAuth, orderController.getCheckoutPage);
router.post('/checkout/processorder', isAuth, orderController.createOrder);


module.exports = router;