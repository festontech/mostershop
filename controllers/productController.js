const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async (req, res, next) => {
    try {
        const products = await Product.find().lean();
        res.render('shop/index', {
            title: 'Welcome to our Shop',
            products,
            pageJS: 'shop', // Optional: if you have /public/js/shop.js
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;