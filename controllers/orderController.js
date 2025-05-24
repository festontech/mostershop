const Order = require('../models/Order');

// Display All Orders for Logged-in User
exports.getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.session.user._id }).lean();
        res.render('user/orders', { title: 'My Orders', orders });
    } catch (err) {
        next(err);
    }
};

// Display a Specific Order
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.session.user._id
        }).lean();

        if (!order) return res.redirect('/orders');
        res.render('shop/order-detail', { title: 'Order Details', order });
    } catch (err) {
        next(err);
    }
};

// Create a New Order
exports.createOrder = async (req, res, next) => {
    try {
        const cart = req.session.cart;
        if (!cart || cart.length === 0) return res.redirect('/cart');

        const total = cart.total.toFixed(2)

        const newOrder = new Order({
            user: req.session.user._id,
            items: cart.items,
            total,
            status: 'Pending'
        });

        await newOrder.save();
console.log('Order saved successfully:', newOrder);
        req.session.cart = [];
        req.session.success_msg = 'Thank you for your order! Your order has been placed successfully.';
        res.redirect('/orders');
    } catch (err) {
        next(err);
    }
};

// Simulated Payment Processing
exports.getCheckoutPage = (req, res) => {
    const cart = req.session.cart || [];


    res.render('shop/checkout', { title: 'checkout', cart  });
};
