const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');

// Middleware to protect routes
const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id;
        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new order
router.post('/', protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
    } else {
      const order = new Order({
        orderItems,
        user: req.user,
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged in user orders
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;