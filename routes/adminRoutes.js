const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const { isAuth, isAdmin } = require('../middleware/auth');

// Apply auth and admin middleware to all routes
router.use(isAuth, isAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard);

// Product management
router.get('/products', adminController.getAllProducts);
router.get('/products/add', adminController.getAddProductPage);
router.get('/products/edit/:id', adminController.getEditProductPage);
router.post('/products/add', adminController.addProduct);
router.post('/products/edit/:id', adminController.updateProduct);
router.post('/products/delete/:id', adminController.deleteProduct);

// Order management
router.get('/orders', adminController.getAllOrders);
router.get('/orders/:id', adminController.getOrderById);
router.post('/orders/:id/status', adminController.updateOrderStatus);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.post('/users/:id/role', adminController.updateUserRole);
router.post('/users/:id/status', adminController.updateUserStatus);

module.exports = router;