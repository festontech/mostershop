const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { isAuth } = require('../middleware/auth');

// Product routes
router.get('/', productController.getAllFeaturedProducts);
router.get('/shop', productController.getAllProducts);
router.get('/shop/product/:id', productController.getProductById);
router.get('/shop/category/:category', productController.getProductsByCategory);
router.get('/shop/search', productController.searchProducts);

// Cart routes
router.get('/cart', productController.getCart);
router.post('/cart/add/:id', productController.addToCart);
router.post('/cart/update/:id', productController.updateCartItem);
router.post('/cart/remove/:id', productController.removeFromCart);

// Order routes (protected)
router.get('/orders', isAuth, orderController.getUserOrders);
router.get('/orders/:id', isAuth, orderController.getOrderById);
router.post('/checkout', isAuth, orderController.createOrder);
router.post('/checkout/process-payment', isAuth, orderController.processPayment);
router.get('/checkout/success', isAuth, orderController.checkoutSuccess);
router.get('/checkout/cancel', isAuth, orderController.checkoutCancel);

module.exports = router;