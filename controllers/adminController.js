const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Dashboard
exports.getDashboard = async (req, res, next) => {
    try {
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        const userCount = await User.countDocuments();

        res.render('admin/dashboard', {
            title: 'Admin Dashboard',
            stats: { productCount, orderCount, userCount }
        });
    } catch (err) {
        next(err);
    }
};

// Product management
exports.getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().lean();
        res.render('admin/products', { title: 'Manage Products', products });
    } catch (err) {
        next(err);
    }
};

exports.getAddProductPage = (req, res) => {
    res.render('admin/add-product', { title: 'Add Product' });
};

exports.getEditProductPage = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.redirect('/admin/products');
        res.render('admin/edit-product', { title: 'Edit Product', product });
    } catch (err) {
        next(err);
    }
};

exports.addProduct = async (req, res, next) => {
    try {
        const { name, price, description, category, image } = req.body;
        const newProduct = new Product({ name, price, description, category, image });
        await newProduct.save();
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body);
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin/products');
    } catch (err) {
        next(err);
    }
};

// Order management
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find().populate('user').lean();
        res.render('admin/orders', { title: 'Manage Orders', orders });
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user').lean();
        if (!order) return res.redirect('/admin/orders');
        res.render('admin/order-detail', { title: 'Order Detail', order });
    } catch (err) {
        next(err);
    }
};

exports.updateOrderStatus = async (req, res, next) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, { status: req.body.status });
        res.redirect(`/admin/orders/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};

// User management
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().lean();
        res.render('admin/users', { title: 'Manage Users', users });
    } catch (err) {
        next(err);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).lean();
        if (!user) return res.redirect('/admin/users');
        res.render('admin/user-detail', { title: 'User Detail', user });
    } catch (err) {
        next(err);
    }
};

exports.updateUserRole = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        res.redirect(`/admin/users/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};

exports.updateUserStatus = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive });
        res.redirect(`/admin/users/${req.params.id}`);
    } catch (err) {
        next(err);
    }
};
